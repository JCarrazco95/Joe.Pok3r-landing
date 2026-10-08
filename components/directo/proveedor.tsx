'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { INTERVALO_CLIENTE_MS, leerEstadoEnVivo, type EstadoEnVivo } from '@/lib/directo'

export type EstadoDirecto = {
  estado: EstadoEnVivo
  /** Aún no ha respondido `/api/en-vivo`: el estado es el del HTML (manual). */
  comprobando: boolean
}

const Contexto = createContext<EstadoDirecto | null>(null)

/**
 * Estado en vivo para toda la página. El HTML (ISR de 30 min) trae solo el
 * interruptor manual; al montar, y luego cada `INTERVALO_CLIENTE_MS` mientras la
 * pestaña esté visible, se pregunta a `/api/en-vivo` (que la CDN cachea 60 s).
 *
 * - Pestaña oculta: no se consulta; al volver se consulta de inmediato si el
 *   dato ya caducó.
 * - Fallo de red o respuesta inválida: se conserva el último estado conocido.
 */
export function ProveedorEnVivo({
  inicial,
  children,
}: {
  inicial: EstadoEnVivo
  children: React.ReactNode
}) {
  const [estado, setEstado] = useState(inicial)
  const [comprobando, setComprobando] = useState(true)

  useEffect(() => {
    let vivo = true
    let control: AbortController | null = null
    let ultima = 0

    const consultar = async () => {
      control?.abort()
      control = new AbortController()
      ultima = Date.now()
      try {
        const r = await fetch('/api/en-vivo', { signal: control.signal })
        if (!r.ok) return
        const nuevo = leerEstadoEnVivo((await r.json()) as unknown)
        if (vivo && nuevo) setEstado(nuevo)
      } catch {
        // Sin red o abortado: se queda el último estado.
      } finally {
        if (vivo) setComprobando(false)
      }
    }

    const temporizador = window.setInterval(() => {
      if (document.visibilityState === 'visible') void consultar()
    }, INTERVALO_CLIENTE_MS)

    const alVolver = () => {
      if (document.visibilityState === 'visible' && Date.now() - ultima >= INTERVALO_CLIENTE_MS) {
        void consultar()
      }
    }
    document.addEventListener('visibilitychange', alVolver)

    void consultar()

    return () => {
      vivo = false
      control?.abort()
      window.clearInterval(temporizador)
      document.removeEventListener('visibilitychange', alVolver)
    }
  }, [])

  const valor = useMemo(() => ({ estado, comprobando }), [estado, comprobando])
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

/** Estado en vivo del proveedor. Fuera de él no hay nada que mostrar. */
export function useEnVivo(): EstadoDirecto | null {
  return useContext(Contexto)
}
