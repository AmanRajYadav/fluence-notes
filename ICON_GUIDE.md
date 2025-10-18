# App Icon Setup Guide for Fluence Notes

## Where to Put Your App Icons

Next.js 14 uses file-based metadata API. Here's where to place your icons:

### Location: `src/app/` directory

Place these icon files directly in the `src/app/` folder (next to `layout.tsx`):

## Required Icon Files

### 1. **favicon.ico** (Browser Tab Icon)
- **Location**: `src/app/favicon.ico`
- **Size**: 32x32 pixels or 16x16 pixels
- **Format**: .ico file
- **Current**: ✅ Already exists (needs replacement with Fluence logo)

### 2. **icon.png** or **icon.svg** (App Icon)
- **Location**: `src/app/icon.png` or `src/app/icon.svg`
- **Recommended sizes**:
  - `icon.png`: 512x512 pixels (PNG format)
  - `icon.svg`: Any size (SVG format, preferred for scalability)
- **Purpose**: Used for PWA icons, browser tabs, social shares
- **Current**: ❌ Missing - needs to be created

### 3. **apple-icon.png** (Apple Touch Icon)
- **Location**: `src/app/apple-icon.png`
- **Size**: 180x180 pixels
- **Format**: PNG
- **Purpose**: iOS home screen icon
- **Current**: ❌ Missing - needs to be created

### 4. **opengraph-image.png** (Social Media Preview)
- **Location**: `src/app/opengraph-image.png`
- **Size**: 1200x630 pixels
- **Format**: PNG or JPG
- **Purpose**: When sharing on social media (Twitter, Facebook, LinkedIn)
- **Current**: ❌ Missing - needs to be created

## Quick Setup Steps

1. **Create or obtain your Fluence logo** in the following formats:
   - SVG (vector, preferred)
   - PNG at 512x512px minimum

2. **Generate all required sizes**:
   - Use a tool like [favicon.io](https://favicon.io/) or [realfavicongenerator.net](https://realfavicongenerator.net/)
   - Upload your logo and it will generate all sizes

3. **Place files in `src/app/`**:
   ```
   src/app/
   ├── favicon.ico          (32x32 or 16x16)
   ├── icon.png             (512x512)
   ├── apple-icon.png       (180x180)
   └── opengraph-image.png  (1200x630)
   ```

4. **Commit and push** to trigger Vercel deployment

5. **Clear browser cache** to see the new icon

## Example File Structure

```
fluence-notes/
└── src/
    └── app/
        ├── layout.tsx
        ├── page.tsx
        ├── favicon.ico          ← Replace this
        ├── icon.png             ← Add this
        ├── apple-icon.png       ← Add this
        └── opengraph-image.png  ← Add this
```

## After Adding Icons

Next.js will automatically detect these files and use them. No code changes needed!

The icons will appear:
- ✅ Browser tab (favicon.ico)
- ✅ PWA install prompt (icon.png)
- ✅ iOS home screen (apple-icon.png)
- ✅ Social media shares (opengraph-image.png)
- ✅ Vercel deployment preview

## Verification

After deployment, check:
1. Browser tab shows your icon
2. View page source - should see `<link rel="icon">` tags
3. Share on social media - should show custom preview image

## Resources

- [Next.js Metadata Files Docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
- [Favicon Generator](https://favicon.io/)
- [Real Favicon Generator](https://realfavicongenerator.net/)
