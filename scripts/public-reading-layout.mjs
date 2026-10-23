// Small editorial pages use the same reading system without modifying URLs or facts.
export function refinePublicReading(html){
 const canonical=html.match(/rel="canonical" href="https:\/\/balzaguk.com([^"?#]*)"/)?.[1];
 if(!['/about/','/guides/','/weekend/'].includes(canonical))return html;
 html=html.replace('<body>','<body class="reading-page editorial-page">');
 if(!html.includes('/internal-pages.css?'))html=html.replace('</head>','<link rel="stylesheet" href="/internal-pages.css?v=20261023-public"></head>');
 return html;
}
