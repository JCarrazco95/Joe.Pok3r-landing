export type MensajeContacto = {
  nombre: string
  correo: string
  propuesta: string
}

/**
 * Envía el formulario de contacto y patrocinios.
 *
 * HOY NO ENVÍA NADA. Es el único punto que falta por conectar: el formulario
 * (components/sections/contacto.tsx) ya llama aquí y muestra su estado de
 * éxito, pero el mensaje se descarta. Antes de publicar hay que elegir el canal
 * (Formspree, Resend con un route handler, WhatsApp…), implementarlo aquí y,
 * cuando exista un enlace directo, rellenar `enlaces.contacto.url`.
 *
 * Debe rechazar la promesa si el envío falla: el formulario mostrará el error
 * en vez de dar por recibido un mensaje que no salió.
 */
export async function enviarContacto(mensaje: MensajeContacto): Promise<void> {
  void mensaje
}
