try {
  const response = await fetch(`https://service-point.sendcloud.sc/api/v2/service-points?postal_code=${postal_code}&country=${country}&carrier=${carrier}`, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Sendcloud API error:', errorText); // 👈 logging
    return res.status(response.status).json({ error: 'Sendcloud API fout', details: errorText });
  }

  const data = await response.json();
  return res.status(200).json(data.service_points || data);
} catch (err) {
  console.error('Fetch fout:', err); // 👈 logging
  return res.status(500).json({ error: 'Interne fout', details: err.message });
}
