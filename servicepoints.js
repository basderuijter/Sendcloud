{\rtf1\ansi\ansicpg1252\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 export default async function handler(req, res) \{\
  const \{ postal_code, country, carrier \} = req.query;\
\
  if (!postal_code || !country || !carrier) \{\
    return res.status(400).json(\{ error: 'postal_code, country en carrier zijn verplicht' \});\
  \}\
\
  const sendcloudKey = process.env.SENDCLOUD_API_KEY;\
\
  try \{\
    const response = await fetch(`https://service-point.sendcloud.sc/api/v2/service-points?postal_code=$\{postal_code\}&country=$\{country\}&carrier=$\{carrier\}`, \{\
      headers: \{\
        Authorization: `Bearer $\{sendcloudKey\}`,\
      \},\
    \});\
\
    if (!response.ok) \{\
      const error = await response.text();\
      return res.status(response.status).json(\{ error \});\
    \}\
\
    const data = await response.json();\
    return res.status(200).json(data.service_points);\
  \} catch (err) \{\
    return res.status(500).json(\{ error: 'Interne fout', details: err.message \});\
  \}\
\}}