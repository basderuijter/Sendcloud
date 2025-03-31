export default async function handler(req, res) {
  const { postal_code, country, carrier } = req.query;

  if (!postal_code || !country || !carrier) {
    return res.status(400).json({ error: 'postal_code, country en carrier zijn verplicht' });
  }

  const publicKey = process.env.SENDCLOUD_PUBLIC_KEY;
  const secretKey = process.env.SENDCLOUD_SECRET_KEY;

  if (!publicKey || !secretKey) {
    return res.status(500).json({ error: 'API-sleutels niet ingesteld in environment variables.' });
  }

  const auth = Buffer.from(`${publicKey}:${secretKey}`).toString('base64');

  try {
    const response = await fetch(`https://service-point.sendcloud.sc/api/v2/service-points?postal_code=${postal_code}&country=${country}&carrier=${carrier}`, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: 'Sendcloud API fout', details: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data.service_points || data);
  } catch (err) {
    return res.status(500).json({ error: 'Interne fout', details: err.message });
  }
}
