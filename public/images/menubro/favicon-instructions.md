# Favicon Generation Instructions

To create a complete set of favicon files for the MenuBro website, follow these steps:

## Required Favicon Files

The website is set up to use the following favicon files:

1. `favicon.ico` - The main favicon file (already exists)
2. `favicon-16x16.png` - 16x16 PNG version
3. `favicon-32x32.png` - 32x32 PNG version
4. `apple-touch-icon.png` - 180x180 PNG for Apple devices
5. `icon-192x192.png` - 192x192 PNG for Android devices
6. `icon-512x512.png` - 512x512 PNG for Progressive Web Apps

## Generation Method 1: Using Online Tools

1. Visit a favicon generator website like [favicon.io](https://favicon.io/) or [realfavicongenerator.net](https://realfavicongenerator.net/)
2. Upload your high-resolution MenuBro logo
3. Configure the settings (colors, background, etc.)
4. Download the generated package
5. Extract the files and place them in the `website/images/` directory

## Generation Method 2: Manual Creation

If you prefer to create the files manually:

1. Start with a high-resolution version of the MenuBro logo (at least 512x512 pixels)
2. Use an image editor like Photoshop, GIMP, or Sketch to create the different sizes
3. Save each size as a PNG file with the appropriate dimensions
4. For favicon.ico, you can use a converter tool to create an ICO file from a PNG

## Testing Your Favicons

After adding all the favicon files to the `images/` directory, test the website in different browsers to ensure the favicon appears correctly:

- Chrome, Firefox, Safari, and Edge for desktop
- iOS Safari and Chrome for mobile
- Android Chrome and Firefox for mobile

## Notes

- The primary color used for the theme is `#06d6a0` (teal/mint green)
- Make sure the favicon is clearly visible on both light and dark backgrounds
- The favicon should be simple enough to be recognizable at small sizes
