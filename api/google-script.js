// api/google-script.js
export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // URL de tu Google Apps Script (actualizada con tu nueva implementación)
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx8U_IWUo38fPGfNrtQ84wDQDTU9JLwbL7RYHpx4wbCDu4IeEAxtEDJSYiHg_Q7Z3seMw/exec";

  try {
    let url = GOOGLE_SCRIPT_URL;
    let options = { method: req.method };

    // GET para login
    if (req.method === 'GET') {
      if (req.query.email) {
        url += `?email=${encodeURIComponent(req.query.email)}`;
      }
      console.log('📡 Consultando Google Apps Script (GET):', url);
    }

    // POST para enviar formulario
    if (req.method === 'POST') {
      const formData = new URLSearchParams();

      // Agregar action al formData
      formData.append('action', req.body.action || 'submit');

      // Agregar todos los campos del body
      for (const [key, value] of Object.entries(req.body)) {
        if (key !== 'action') {
          formData.append(key, value);
        }
      }

      options.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      };
      options.body = formData.toString();

      console.log('📤 Enviando datos a Google Apps Script (POST):', url);
    }

    const response = await fetch(url, options);
    const text = await response.text();

    console.log('📥 Respuesta cruda de Google Script:', text.substring(0, 300));

    // Intentar parsear como JSON
    let jsonData;
    try {
      jsonData = JSON.parse(text);
      console.log('✅ Respuesta JSON válida');
    } catch (parseError) {
      console.log('⚠️ La respuesta no es JSON válido, creando estructura de error');
      // Si no es JSON, devolver un objeto de error
      jsonData = {
        success: false,
        error: 'Respuesta inválida del servidor',
        rawResponse: text.substring(0, 200)
      };
    }

    // Devolver siempre una estructura JSON consistente
    return res.status(200).json({
      success: true,
      data: jsonData
    });

  } catch (error) {
    console.error('❌ Error en función serverless:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      details: 'Error al conectar con Google Apps Script'
    });
  }
}
