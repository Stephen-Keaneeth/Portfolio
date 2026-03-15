
# Exploring an Exoplanet Using Real Astronomical Data  
## A Data‑Driven Study of TRAPPIST‑1e

One of the most fascinating developments in modern astronomy is the discovery of **exoplanets** — planets that orbit stars outside our solar system. With the availability of open astronomical datasets from NASA and other space agencies, it has become possible for students and researchers to work with real observational data.

This project focused on analyzing the exoplanet **TRAPPIST‑1e** using publicly available light curve data. The objective was simple: understand the physics behind exoplanet detection and extract meaningful physical parameters from real data.

---

## Why TRAPPIST‑1e?

TRAPPIST‑1e is part of the famous **TRAPPIST‑1 planetary system**, located about **40 light‑years away in the constellation Aquarius**.

This system attracted significant attention because several of its planets orbit within the **habitable zone**, the region around a star where liquid water could potentially exist.

### Key Characteristics

| Property | Value |
|--------|--------|
| Host Star | TRAPPIST‑1 |
| Star Type | Ultra‑cool red dwarf |
| Distance | ~40 light years |
| Orbital Period | ~6.1 days |
| Detection Method | Transit photometry |
| Planet Type | Likely rocky |

Because the host star is much smaller and cooler than the Sun, its habitable zone lies much closer to the star.

---

## The Transit Method

The **transit method** detects planets by observing periodic dips in the brightness of a star.

When a planet passes in front of its star, it blocks a small fraction of the star’s light. This produces a small dip in brightness called a **transit**.

The quantity that astronomers measure is called **transit depth**:

δ = (F_out − F_in) / F_out

Where:

F_out = stellar flux outside the transit  
F_in = stellar flux during the transit

Transit depth directly relates to the relative size of the planet and its star.

---

## Working With Real Light Curve Data

The light curve dataset was obtained from NASA's astronomical archive. The dataset contained time‑series observations of stellar brightness.

The workflow followed during analysis:

1. Download the light curve CSV dataset
2. Import the dataset into Excel
3. Plot **Flux vs Time**
4. Identify the transit dip
5. Estimate the transit depth manually

A clear dip in brightness was visible during the transit event, indicating the presence of the planet passing in front of the star.

---

## Estimating the Planet Radius

Once the transit depth is known, the planetary radius can be estimated using:

R_p = R_* √δ

Where:

R_p = planetary radius  
R_* = stellar radius  
δ = transit depth

Using known stellar parameters of TRAPPIST‑1 and the estimated transit depth, we can approximate the radius of TRAPPIST‑1e.

This demonstrates how astronomical measurements allow us to estimate the size of planets many light‑years away.

---

## Physical Interpretation

After estimating the physical parameters, we can interpret the characteristics of TRAPPIST‑1e.

### Planet Composition

Scientific studies suggest that TRAPPIST‑1e is a **rocky terrestrial planet**, similar in size to Earth.

### Habitable Zone

TRAPPIST‑1e lies within the **habitable zone** of its host star, meaning that temperatures may allow liquid water under the right atmospheric conditions.

### Atmosphere

Future observations from telescopes such as the **James Webb Space Telescope (JWST)** aim to study atmospheric signatures of planets in the TRAPPIST‑1 system.

---

## What This Project Demonstrates

This project highlights how:

• Real astronomical data can be accessed publicly  
• Physics equations allow extraction of planetary properties  
• Even simple tools like Excel can reveal meaningful astrophysical insights  

Most importantly, the exercise reinforced a key idea:

**Science is not only about describing the universe — it is about measuring and interpreting it.**

---

## Conclusion

TRAPPIST‑1e remains one of the most intriguing exoplanets discovered so far. With continued observations and improved telescope technology, scientists may soon learn more about its atmosphere, composition, and potential habitability.

Projects like this help bridge the gap between **learning physics concepts and applying them to real scientific data**.

---

*Project: Exoplanet Data Analysis – TRAPPIST‑1e*
