// ── Cloudflare R2 Configuration ─────────────────────────────────────────────────
export const R2_CONFIG = {
  accountId: process.env.R2_ACCOUNT_ID!,
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  bucketName: process.env.R2_BUCKET_NAME!,
  endpoint: process.env.R2_ENDPOINT!,
  cdnUrl: process.env.NEXT_PUBLIC_CDN_URL!
};

// ── Validate R2 configuration ─────────────────────────────────────────────────
export function validateR2Config(): boolean {
  const config = R2_CONFIG;
  
  if (!config.accountId || !config.accessKeyId || !config.secretAccessKey || 
      !config.bucketName || !config.endpoint || !config.cdnUrl) {
    console.error("Missing R2 configuration. Please check environment variables:");
    console.error("- R2_ACCOUNT_ID:", config.accountId ? "✓" : "✗");
    console.error("- R2_ACCESS_KEY_ID:", config.accessKeyId ? "✓" : "✗");
    console.error("- R2_SECRET_ACCESS_KEY:", config.secretAccessKey ? "✓" : "✗");
    console.error("- R2_BUCKET_NAME:", config.bucketName ? "✓" : "✗");
    console.error("- R2_ENDPOINT:", config.endpoint ? "✓" : "✗");
    console.error("- NEXT_PUBLIC_CDN_URL:", config.cdnUrl ? "✓" : "✗");
    return false;
  }
  
  return true;
}
