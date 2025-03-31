export default async function handler(req, res) {
  const { postal_code, country, carrier } = req.query;

  if (!postal_code || !country || !carrier) {
    return res.status(400).json({ error: 'postal_code, country en carrier zijn verplicht' });
  }

  const sendcloudKey = process.env.SENDCLOUD_API_KEY;

  try {
    const response = await fetch(`https://service-point.sendcloud.sc/api/v2/service-points?postal_code=${postal_code}&country=${country}&carrier=${carrier}`, {
      headers: {
        Authorization: `Bearer ${sendcloudKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    return res.status(200).json(data.service_points);
  } catch (err) {
    return res.status(500).json({ error: 'Interne fout', details: err.message });
  }
}
