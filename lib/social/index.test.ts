import { readFileSync } from 'node:fs'
import { afterEach, describe, expect, it } from 'vitest'
import { REVALIDAR_SEG } from './config'
import { MAX_POSTS_POR_RED, MAX_POSTS_TOTAL, obtenerFeed } from './index'
import { manual } from './manual'
import type { Adaptador, PostSocial, RedFeed, ResultadoAdaptador } from './types'

const post = (red: RedFeed, n: number, fecha: string): PostSocial => ({
  red,
  id: `${red}-${n}`,
  url: `https://example.com/${red}/${n}`,
  texto: `post ${n}`,
  media: null,
  fecha,
})

const vacio = (red: RedFeed): Adaptador => async () => ({ red, origen: 'vacio', posts: [] })
const real =
  (red: RedFeed, posts: PostSocial[]): Adaptador =>
  async () => ({ red, origen: 'real', posts })

const todos = (sobre: Partial<Record<RedFeed, Adaptador>> = {}): Record<RedFeed, Adaptador> => ({
  youtube: vacio('youtube'),
  kick: vacio('kick'),
  instagram: vacio('instagram'),
  tiktok: vacio('tiktok'),
  facebook: vacio('facebook'),
  ...sobre,
})

afterEach(() => {
  for (const red of Object.keys(manual) as RedFeed[]) manual[red].length = 0
})

describe('obtenerFeed', () => {
  it('mezcla redes, ordena por fecha descendente y marca el origen', async () => {
    const f = await obtenerFeed(
      todos({
        youtube: real('youtube', [post('youtube', 1, '2026-09-01T00:00:00Z'), post('youtube', 2, '2026-09-10T00:00:00Z')]),
        kick: real('kick', [post('kick', 1, '2026-09-05T00:00:00Z')]),
      }),
    )
    expect(f.posts.map((p) => p.id)).toEqual(['youtube-2', 'kick-1', 'youtube-1'])
    expect(f.fuentes.find((s) => s.red === 'youtube')).toMatchObject({ origen: 'real', total: 2 })
    expect(f.fuentes.find((s) => s.red === 'facebook')).toMatchObject({ origen: 'vacio', total: 0 })
    expect(f.fuentes).toHaveLength(5)
  })

  it('un adaptador que lanza no tumba a los demás y cae al manual', async () => {
    manual.youtube.push({ url: 'https://www.youtube.com/watch?v=ZZZZZZZZZZZ', fecha: '2026-09-02' })
    const roto: Adaptador = async () => {
      throw new Error('boom')
    }
    const f = await obtenerFeed(
      todos({ youtube: roto, kick: real('kick', [post('kick', 1, '2026-09-05T00:00:00Z')]) }),
    )
    expect(f.fuentes.find((s) => s.red === 'youtube')).toMatchObject({
      origen: 'manual',
      total: 1,
      motivo: 'Error inesperado',
    })
    expect(f.posts.map((p) => p.red).sort()).toEqual(['kick', 'youtube'])
  })

  it('real sin posts usa el manual; sin manual queda vacío', async () => {
    manual.kick.push({ url: 'https://kick.com/demo/clips/abc', fecha: '2026-09-02' })
    const f = await obtenerFeed(todos({ kick: real('kick', []), youtube: real('youtube', []) }))
    expect(f.fuentes.find((s) => s.red === 'kick')).toMatchObject({ origen: 'manual', total: 1 })
    expect(f.fuentes.find((s) => s.red === 'youtube')).toMatchObject({ origen: 'vacio', total: 0 })
  })

  it('no sustituye posts reales por manuales', async () => {
    manual.youtube.push({ url: 'https://www.youtube.com/watch?v=ZZZZZZZZZZZ', fecha: '2026-09-02' })
    const f = await obtenerFeed(todos({ youtube: real('youtube', [post('youtube', 1, '2026-09-01T00:00:00Z')]) }))
    expect(f.posts).toHaveLength(1)
    expect(f.fuentes.find((s) => s.red === 'youtube')?.origen).toBe('real')
  })

  it('aplica los límites por red y total', async () => {
    const muchos = (red: RedFeed) =>
      Array.from({ length: 40 }, (_, i) => post(red, i, new Date(2026, 0, 1 + i).toISOString()))
    const f = await obtenerFeed(
      todos({
        youtube: real('youtube', muchos('youtube')),
        kick: real('kick', muchos('kick')),
        instagram: real('instagram', muchos('instagram')),
        tiktok: real('tiktok', muchos('tiktok')),
        facebook: real('facebook', muchos('facebook')),
      }),
    )
    for (const s of f.fuentes) expect(s.total).toBe(MAX_POSTS_POR_RED)
    expect(f.posts.length).toBe(Math.min(MAX_POSTS_TOTAL, MAX_POSTS_POR_RED * 5))
  })

  it('descarta duplicados y posts de otra red', async () => {
    const extraño = { ...post('kick', 9, '2026-09-09T00:00:00Z') }
    const r: ResultadoAdaptador = {
      red: 'youtube',
      origen: 'real',
      posts: [post('youtube', 1, '2026-09-01T00:00:00Z'), post('youtube', 1, '2026-09-01T00:00:00Z'), extraño],
    }
    const f = await obtenerFeed(todos({ youtube: async () => r }))
    expect(f.posts.map((p) => p.id)).toEqual(['youtube-1'])
  })
})

describe('route', () => {
  it('revalidate del route handler coincide con REVALIDAR_SEG', () => {
    const fuente = readFileSync(new URL('../../app/api/social/route.ts', import.meta.url), 'utf8')
    const m = fuente.match(/export const revalidate = (\d+)/)
    expect(Number(m?.[1])).toBe(REVALIDAR_SEG)
  })
})
