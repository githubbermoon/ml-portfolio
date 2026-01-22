# Technical Handoff: Liquid Orb & Ghost Silk

## 1. Project Context

- **Framework**: Astro 5.x + React 18
- **3D Engine**: @react-three/fiber (R3F) + @react-three/drei + Three.js
- **Styling**: TailwindCSS

## 2. Component Implementations

### A. Liquid Orb (`src/islands/LiquidOrb.tsx`)

A 3D glass orb with a "liquid text" effect.

- **Geometry**: `SphereGeometry` (args: 1, 64, 64) scaled to 1.8.
- **Material**: `MeshTransmissionMaterial` from `@react-three/drei`.
  - Key props: `distortion={0.8}`, `temporalDistortion={0.2}`, `ior={1.5}`.
  - This creates the warping/liquid effect by refracting the background.
- **Text Embedding**:
  - Two `<Text>` components ("अनंत" and "The Infinite") are placed **inside the `Float` group** but slightly behind the sphere (`z={-0.5}`).
  - Because they are behind the sphere, the `MeshTransmissionMaterial` actively distorts them, creating the "on liquid" swerving effect requested by the user.

### B. Ghost Silk (`src/islands/GhostSilk.tsx`)

A fullscreen ambient background effect using a vertex-displaced plane.

- **Implementation**: Custom `SilkPlane` component.
- **Geometry**: `PlaneGeometry` (10, 10, 128, 128) - high vertex density for smooth waves.
- **Animation**: `useFrame` hook modifies `attributes.position.z` using a superposition of 3 sine waves based on time.
  ```javascript
  z = wave1(slow) + wave2(medium) + wave3(fine_ripple);
  ```
- **Visibility**:
  - Mounted in `src/pages/blog/technical.astro`.
  - Toggled via CSS classes: `opacity-0 pointer-events-none` <-> `opacity-100 pointer-events-auto`.
  - **Important**: We do NOT use `display: none` because R3F Canvases detatch/crash if hidden this way. We use opacity/pointer-events instead.

## 3. Current Issue: "Invalid Hook Call"

**State**: The project throws `Warning: Invalid hook call` repeatedly and freezes interaction.
**Symptoms**:

- 3D Canvases do not render (or render once then freeze).
- Click events work (console logs show), but React updates fail.
- Terminal output is flooded with React warnings.

**Hypothesis & Attempts**:

- **Cause**: Standard React "Duplicate React" issue. R3F matches React 18, but a dependency might have pulled in React 19 types or a secondary instance.
- **Attempted Fixes**:
  - `pnpm install` (Clean install)
  - Manually checking `npm list react` (showed `deduped` mostly).
  - Enforced `dedupe: ['react', 'react-dom']` in `astro.config.mjs`.

## 4. Key Files

- `src/islands/LiquidOrb.tsx` (The Orb)
- `src/islands/GhostSilk.tsx` (The Silk)
- `src/pages/blog/technical.astro` (The consumption page)
- `package.json` (Dependencies)
