const fs = require('fs');
const path = require('path');

const clients = [
  { id: "taj-vivanta-vadodara", text: "TAJ VIVANTA", subtext: "VADODARA" },
  { id: "taj-vivanta-kevadia", text: "TAJ VIVANTA", subtext: "KEVADIA" },
  { id: "fern-vadodara", text: "THE FERN", subtext: "VADODARA" },
  { id: "fern-kevadia", text: "THE FERN", subtext: "KEVADIA" },
  { id: "fortune-vadodara", text: "FORTUNE", subtext: "VADODARA" },
  { id: "fortune-kevadia", text: "FORTUNE", subtext: "KEVADIA" },
  { id: "sayaji", text: "SAYAJI" },
  { id: "suba", text: "SUBA HOTELS" },
  { id: "spice-kraft", text: "SPICE KRAFT" },
  { id: "secret-kitchen", text: "SECRET KITCHEN" },
  { id: "22nd-parallel", text: "22ND PARALLEL" },
  { id: "shashi-catering", text: "SHASHI CATERING" },
  { id: "sukhadiya", text: "SUKHADIYA" },
  { id: "patel", text: "PATEL" },
  { id: "new-patel", text: "NEW PATEL" },
  { id: "shyam", text: "SHYAM" },
  { id: "jay-pepper-cream", text: "PEPPER CREAM" },
  { id: "kuisine", text: "KUISINE" },
];

clients.forEach(client => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="transparent"/>
  <text x="100" y="${client.subtext ? '35' : '45'}" font-family="Georgia, serif" font-size="20" font-weight="bold" fill="#4a4a4a" text-anchor="middle" dominant-baseline="middle" letter-spacing="1.5">
    ${client.text}
  </text>
  ${client.subtext ? `<text x="100" y="55" font-family="system-ui, sans-serif" font-size="10" font-weight="normal" fill="#888888" text-anchor="middle" dominant-baseline="middle" letter-spacing="2">${client.subtext}</text>` : ''}
</svg>`;
  
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'images', 'clients', `${client.id}.svg`), svg);
});

console.log('Logos generated successfully!');
