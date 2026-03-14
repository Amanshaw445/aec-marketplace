# Responsiveness TODO

## Plan Implementation Steps

### 1. **Hide ActionBar on desktop** ✅ [Completed after edit]
   - Add `lg:hidden` to ActionBar root

### 2. **Update App.jsx layout** ✅ [Completed]
   - Responsive max-w-2xl → lg:max-w-7xl
   - Responsive pt-[112px] → lg:pt-20
   - Responsive px-4 → lg:px-8

### 3. **Desktop Navbar in Navbar.jsx**
   - h-14 → h-14 lg:h-20
   - lg: horizontal nav (Home, Sell, Liked, My Listings, About)
   - Hide hamburger/drawer on lg
   - Adjust logo/Heart/Login for desktop spacing

### 4. **Test responsiveness**
   - Run `npm run dev`
   - Check mobile (<1024px): unchanged
   - Tablet (1024px): wider content
   - Desktop (>1024px): full nav, wide layout

### 5. **Optional refinements**
   - HomePage: lg:grid-cols-2 xl:grid-cols-3 for products
   - Adjust shadows/paddings if needed

**Next step: 1/5**
