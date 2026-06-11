// api/google-script.js
export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxnIXtrzEqGH4zBWcse3IHkNbhEDxR-0ULPIGQpLjXRaXH1pV0Gzd16W0kOXNEeNQq-2Q/exec";

  try {
    // GET para login
    if (req.method === 'GET') {
      let url = GOOGLE_SCRIPT_URL;
      if (req.query.email) {
        url += `?email=${encodeURIComponent(req.query.email)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      return res.status(200).json(data);
    }

    // POST para enviar formulario
    if (req.method === 'POST') {
      // Obtener el body
      const body = req.body;
      
      // Crear FormData
      const formData = new URLSearchParams();
      formData.append('action', 'submit');
      formData.append('email', body.email || '');
      formData.append('nombre', body.nombre || '');
      formData.append('planestudio', body.planestudio || '');
      formData.append('curso', body.curso || '');
      formData.append('pead', body.pead || '');
      formData.append('docente', body.docente || '');
      formData.append('respuestas', body.respuestas || '');
      
      console.log('📤 Enviando:', formData.toString());
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });
      
      const text = await response.text();
      console.log('📥 Respuesta:', text);
      
      try {
        const jsonData = JSON.parse(text);
        return res.status(200).json(jsonData);
      } catch (e) {
        return res.status(200).json({ success: true, raw: text });
      }
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    console.error('❌ Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
