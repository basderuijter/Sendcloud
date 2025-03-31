export default async function handler(req, res) {
  const { address, country, carrier } = req.query;

  if (!address || !country) {
    return res.status(400).json({ error: 'address en country zijn verplicht' });
  }

  const accessToken = process.env.SENDCLOUD_ACCESS_TOKEN;
  const bearerToken = process.env.SENDCLOUD_BEARER_TOKEN;

  if (!accessToken || !bearerToken) {
    return res.status(500).json({ error: 'API tokens niet ingesteld in environment variables.' });
  }

  const url = new URL('https://servicepoints.sendcloud.sc/api/v2/service-points');
  url.searchParams.set('country', country);
  url.searchParams.set('address', address);
  url.searchParams.set('access_token', accessToken);
  if (carrier) url.searchParams.set('carrier', carrier);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sendcloud API error:', errorText);
      return res.status(response.status).json({ error: 'Sendcloud API fout', details: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Fetch fout:', err);
    return res.status(500).json({ error: 'Interne fout', details: err.message });
  }
}
