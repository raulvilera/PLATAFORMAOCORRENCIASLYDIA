/**
 * Script para baixar imagens do Blogger e fazer upload para Supabase Storage.
 * Execute com: node upload-images.js
 */
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');

const supabaseUrl = 'https://zvuxzrfbmmbhuhwaofrn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2dXh6cmZibW1iaHVod2FvZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2ODkxNDEsImV4cCI6MjA4MjI2NTE0MX0.GpA8qLVeLF01x0baSALC1AmRTcKL90ALpxt35qKLVTQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const IMAGES = [
    {
        name: 'brasao-sp.png',
        url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZfTy5xfi15DF0i2eoQMxKRZiJRytIZS05mBnKwlvK8u_YBQMrVycjy1wQPlYrWYJOwaz33y6H8GzJaCfV3fb151VeodSwalbpa6xUbarR9tBoRfh863RBLD1FclS2qX3NQfilf8SV-gcpKtjAg48s7N_ELHVGqwLyg9Qttce99OBSi_oY3za4yFs2s0v9/s206/Bras%C3%A3o.PNG'
    },
    {
        name: 'logo-lkm.png',
        url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjqAsB6ThMLLLLsuZ2yx8qAn8Koh4k4naDt3dSMtnPRxb_wWFP84Ve5mnuUTBLP2COJAi8cfYMRrN0qWKyUFJV8pjQXbhrLb2yc2K8mJ5qsqsSCor4fJcdl2IDn-Xtqtqc31I-5_BWai_JljBZIMRVr-SB5vW04GE8gefLARCWrun9gIx10lkCVN6coAV24/s229/images-removebg-preview.png'
    }
];

function downloadImage(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
            // Handle redirects
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                console.log(`  Redirecting to: ${response.headers.location}`);
                return downloadImage(response.headers.location).then(resolve).catch(reject);
            }
            if (response.statusCode !== 200) {
                return reject(new Error(`HTTP ${response.statusCode} for ${url}`));
            }
            const chunks = [];
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => resolve(Buffer.concat(chunks)));
            response.on('error', reject);
        }).on('error', reject);
    });
}

async function main() {
    console.log('=== Upload de Imagens para Supabase Storage ===\n');

    for (const img of IMAGES) {
        console.log(`📥 Baixando: ${img.name}...`);
        try {
            const buffer = await downloadImage(img.url);
            console.log(`  ✅ Baixado: ${buffer.length} bytes`);

            // Upload para o bucket incident-pdfs na pasta "assets"
            const filePath = `assets/${img.name}`;
            console.log(`📤 Enviando para Supabase: ${filePath}...`);

            const { data, error } = await supabase.storage
                .from('incident-pdfs')
                .upload(filePath, buffer, {
                    contentType: 'image/png',
                    cacheControl: '31536000',
                    upsert: true
                });

            if (error) {
                console.error(`  ❌ Erro no upload: ${error.message}`);
                continue;
            }

            console.log(`  ✅ Upload concluído: ${data.path}`);

            // Obter URL pública
            const { data: publicUrlData } = supabase.storage
                .from('incident-pdfs')
                .getPublicUrl(filePath);

            console.log(`  🔗 URL pública: ${publicUrlData.publicUrl}\n`);
        } catch (err) {
            console.error(`  ❌ Erro: ${err.message}\n`);
        }
    }

    console.log('=== Processo finalizado ===');
}

main();
