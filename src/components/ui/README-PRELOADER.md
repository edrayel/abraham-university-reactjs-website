# Abraham University Preloader

A beautiful, animated preloader component that displays the university logo with elegant animations for first-time visitors to the website.

## Features

- **First-Visit Detection**: Only shows for first-time visitors using localStorage
- **Elegant Animations**: Smooth logo animations with glow effects and loading indicators
- **Responsive Design**: Adapts to different screen sizes
- **Performance Optimized**: Skips animation for returning visitors
- **Accessible**: Proper alt text and semantic structure

## How It Works

1. **First Visit**: When a user visits the site for the first time, the preloader displays with:
   - Logo animation with 3D rotation and scaling effects
   - Glowing background effects
   - University name with elegant typography
   - Loading dots animation
   - Welcome message

2. **Subsequent Visits**: The preloader is skipped entirely for better user experience

3. **Local Storage**: Visit status is stored in `localStorage` with key `abraham-university-visited`

## Animation Sequence

1. **Loading Phase** (0-2.5s): Logo scales in with rotation, glow effects, loading dots
2. **Complete Phase** (2.5-3.2s): Logo brightens, welcome message appears
3. **Exit Phase** (3.2-3.8s): Smooth fade out transition

## Testing the Preloader

### Method 1: Browser Console
```javascript
// Test the preloader (clears visit status and reloads)
window.testPreloader()

// Check current visit status
window.checkVisitStatus()
```

### Method 2: Manual localStorage Clearing
```javascript
// Clear visit status
localStorage.removeItem('abraham-university-visited')
// Then refresh the page
location.reload()
```

### Method 3: Incognito/Private Browsing
Open the site in an incognito/private browsing window to see the preloader.

## File Structure

```
src/
├── components/ui/
│   ├── Preloader.jsx          # Main preloader component
│   └── README-PRELOADER.md    # This documentation
├── utils/
│   └── preloaderUtils.js      # Utility functions for preloader
└── App.jsx                    # Integration point
```

## Customization

### Timing Adjustments
Edit the timeout values in `Preloader.jsx`:
```javascript
const timer1 = setTimeout(() => {
  setAnimationPhase('complete');
}, 2500); // Adjust logo animation duration

const timer2 = setTimeout(() => {
  setAnimationPhase('exit');
}, 3200); // Adjust hold duration

const timer3 = setTimeout(() => {
  setIsVisible(false);
  markAsVisited();
  onComplete?.();
}, 3800); // Adjust exit duration
```

### Styling Modifications
The preloader uses Tailwind CSS classes. Key styling elements:
- Background: `bg-gradient-to-br from-primary via-primary/95 to-primary/90`
- Logo size: `w-32 h-32 md:w-40 md:h-40`
- Colors: Uses theme colors `primary`, `victorian-gold-bright`, `minimalist-white`

### Logo Replacement
To use a different logo:
1. Replace `/assets/img/abraham-logo.avif` with your logo
2. Update the `src` attribute in the Preloader component
3. Adjust sizing classes if needed

## Browser Compatibility

- Modern browsers with CSS Grid and Flexbox support
- localStorage support required
- Framer Motion animations supported

## Performance Notes

- Logo image is preloaded as part of the component
- Animations use GPU acceleration via CSS transforms
- Component unmounts completely after animation
- No performance impact on subsequent visits

## Accessibility

- Proper alt text for logo image
- Semantic HTML structure
- Respects user's motion preferences (can be enhanced)
- High contrast colors for readability

## Future Enhancements

- [ ] Respect `prefers-reduced-motion` media query
- [ ] Add sound effects option
- [ ] Progress bar for actual loading states
- [ ] Multiple logo animation variants
- [ ] Theme-based color variations