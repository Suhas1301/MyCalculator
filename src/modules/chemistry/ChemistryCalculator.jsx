import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Atom, Scale, X, Activity, Thermometer, RefreshCw, Waves } from 'lucide-react';

// ─── ELEMENT GRID DATA (period/group for CSS grid placement) ─────────────────
const elementsData = [
  { number: 1,  symbol: 'H',     name: 'Hydrogen',      mass: 1.008,    category: 'nonmetal',       period: 1,  group: 1,  config: '1s¹',                     state: 'gas',       discoverer: 'Henry Cavendish (1766)' },
  { number: 2,  symbol: 'He',    name: 'Helium',        mass: 4.0026,   category: 'noble-gas',      period: 1,  group: 18, config: '1s²',                     state: 'gas',       discoverer: 'Janssen & Lockyer (1868)' },
  { number: 3,  symbol: 'Li',    name: 'Lithium',       mass: 6.94,     category: 'alkali',         period: 2,  group: 1,  config: '[He] 2s¹',                state: 'solid',     discoverer: 'Johan August Arfwedson (1817)' },
  { number: 4,  symbol: 'Be',    name: 'Beryllium',     mass: 9.0122,   category: 'alkaline-earth', period: 2,  group: 2,  config: '[He] 2s²',                state: 'solid',     discoverer: 'Louis Nicolas Vauquelin (1798)' },
  { number: 5,  symbol: 'B',     name: 'Boron',         mass: 10.81,    category: 'metalloid',      period: 2,  group: 13, config: '[He] 2s² 2p¹',            state: 'solid',     discoverer: 'Joseph Louis Gay-Lussac (1808)' },
  { number: 6,  symbol: 'C',     name: 'Carbon',        mass: 12.011,   category: 'nonmetal',       period: 2,  group: 14, config: '[He] 2s² 2p²',            state: 'solid',     discoverer: 'Ancient Egypt (3750 BC)' },
  { number: 7,  symbol: 'N',     name: 'Nitrogen',      mass: 14.007,   category: 'nonmetal',       period: 2,  group: 15, config: '[He] 2s² 2p³',            state: 'gas',       discoverer: 'Daniel Rutherford (1772)' },
  { number: 8,  symbol: 'O',     name: 'Oxygen',        mass: 15.999,   category: 'nonmetal',       period: 2,  group: 16, config: '[He] 2s² 2p⁴',            state: 'gas',       discoverer: 'Carl Wilhelm Scheele (1773)' },
  { number: 9,  symbol: 'F',     name: 'Fluorine',      mass: 18.998,   category: 'halogen',        period: 2,  group: 17, config: '[He] 2s² 2p⁵',            state: 'gas',       discoverer: 'Henri Moissan (1886)' },
  { number: 10, symbol: 'Ne',    name: 'Neon',          mass: 20.180,   category: 'noble-gas',      period: 2,  group: 18, config: '[He] 2s² 2p⁶',            state: 'gas',       discoverer: 'Morris Travers & William Ramsay (1898)' },
  { number: 11, symbol: 'Na',    name: 'Sodium',        mass: 22.990,   category: 'alkali',         period: 3,  group: 1,  config: '[Ne] 3s¹',                state: 'solid',     discoverer: 'Humphry Davy (1807)' },
  { number: 12, symbol: 'Mg',    name: 'Magnesium',     mass: 24.305,   category: 'alkaline-earth', period: 3,  group: 2,  config: '[Ne] 3s²',                state: 'solid',     discoverer: 'Joseph Black (1755)' },
  { number: 13, symbol: 'Al',    name: 'Aluminium',     mass: 26.982,   category: 'post-transition',period: 3,  group: 13, config: '[Ne] 3s² 3p¹',            state: 'solid',     discoverer: 'Hans Christian Ørsted (1825)' },
  { number: 14, symbol: 'Si',    name: 'Silicon',       mass: 28.085,   category: 'metalloid',      period: 3,  group: 14, config: '[Ne] 3s² 3p²',            state: 'solid',     discoverer: 'Jöns Jacob Berzelius (1823)' },
  { number: 15, symbol: 'P',     name: 'Phosphorus',    mass: 30.974,   category: 'nonmetal',       period: 3,  group: 15, config: '[Ne] 3s² 3p³',            state: 'solid',     discoverer: 'Hennig Brand (1669)' },
  { number: 16, symbol: 'S',     name: 'Sulfur',        mass: 32.06,    category: 'nonmetal',       period: 3,  group: 16, config: '[Ne] 3s² 3p⁴',            state: 'solid',     discoverer: 'Ancient China (2000 BC)' },
  { number: 17, symbol: 'Cl',    name: 'Chlorine',      mass: 35.45,    category: 'halogen',        period: 3,  group: 17, config: '[Ne] 3s² 3p⁵',            state: 'gas',       discoverer: 'Carl Wilhelm Scheele (1774)' },
  { number: 18, symbol: 'Ar',    name: 'Argon',         mass: 39.948,   category: 'noble-gas',      period: 3,  group: 18, config: '[Ne] 3s² 3p⁶',            state: 'gas',       discoverer: 'Lord Rayleigh & William Ramsay (1894)' },
  { number: 19, symbol: 'K',     name: 'Potassium',     mass: 39.098,   category: 'alkali',         period: 4,  group: 1,  config: '[Ar] 4s¹',                state: 'solid',     discoverer: 'Humphry Davy (1807)' },
  { number: 20, symbol: 'Ca',    name: 'Calcium',       mass: 40.078,   category: 'alkaline-earth', period: 4,  group: 2,  config: '[Ar] 4s²',                state: 'solid',     discoverer: 'Humphry Davy (1808)' },
  { number: 21, symbol: 'Sc',    name: 'Scandium',      mass: 44.956,   category: 'transition-metal',period: 4, group: 3,  config: '[Ar] 3d¹ 4s²',            state: 'solid',     discoverer: 'Lars Fredrik Nilson (1879)' },
  { number: 22, symbol: 'Ti',    name: 'Titanium',      mass: 47.867,   category: 'transition-metal',period: 4, group: 4,  config: '[Ar] 3d² 4s²',            state: 'solid',     discoverer: 'William Gregor (1791)' },
  { number: 23, symbol: 'V',     name: 'Vanadium',      mass: 50.942,   category: 'transition-metal',period: 4, group: 5,  config: '[Ar] 3d³ 4s²',            state: 'solid',     discoverer: 'Andrés Manuel del Río (1801)' },
  { number: 24, symbol: 'Cr',    name: 'Chromium',      mass: 51.996,   category: 'transition-metal',period: 4, group: 6,  config: '[Ar] 3d⁵ 4s¹',            state: 'solid',     discoverer: 'Louis Nicolas Vauquelin (1797)' },
  { number: 25, symbol: 'Mn',    name: 'Manganese',     mass: 54.938,   category: 'transition-metal',period: 4, group: 7,  config: '[Ar] 3d⁵ 4s²',            state: 'solid',     discoverer: 'Carl Wilhelm Scheele (1774)' },
  { number: 26, symbol: 'Fe',    name: 'Iron',          mass: 55.845,   category: 'transition-metal',period: 4, group: 8,  config: '[Ar] 3d⁶ 4s²',            state: 'solid',     discoverer: 'Before 5000 BC' },
  { number: 27, symbol: 'Co',    name: 'Cobalt',        mass: 58.933,   category: 'transition-metal',period: 4, group: 9,  config: '[Ar] 3d⁷ 4s²',            state: 'solid',     discoverer: 'Georg Brandt (1735)' },
  { number: 28, symbol: 'Ni',    name: 'Nickel',        mass: 58.693,   category: 'transition-metal',period: 4, group: 10, config: '[Ar] 3d⁸ 4s²',            state: 'solid',     discoverer: 'Axel Fredrik Cronstedt (1751)' },
  { number: 29, symbol: 'Cu',    name: 'Copper',        mass: 63.546,   category: 'transition-metal',period: 4, group: 11, config: '[Ar] 3d¹⁰ 4s¹',           state: 'solid',     discoverer: 'Middle East (9000 BC)' },
  { number: 30, symbol: 'Zn',    name: 'Zinc',          mass: 65.38,    category: 'transition-metal',period: 4, group: 12, config: '[Ar] 3d¹⁰ 4s²',           state: 'solid',     discoverer: 'Indian chemists (before 1000 BC)' },
  { number: 31, symbol: 'Ga',    name: 'Gallium',       mass: 69.723,   category: 'post-transition',period: 4,  group: 13, config: '[Ar] 3d¹⁰ 4s² 4p¹',      state: 'solid',     discoverer: 'Paul-Émile Lecoq de Boisbaudran (1875)' },
  { number: 32, symbol: 'Ge',    name: 'Germanium',     mass: 72.630,   category: 'metalloid',      period: 4,  group: 14, config: '[Ar] 3d¹⁰ 4s² 4p²',      state: 'solid',     discoverer: 'Clemens Winkler (1886)' },
  { number: 33, symbol: 'As',    name: 'Arsenic',       mass: 74.922,   category: 'metalloid',      period: 4,  group: 15, config: '[Ar] 3d¹⁰ 4s² 4p³',      state: 'solid',     discoverer: 'Albertus Magnus (1250)' },
  { number: 34, symbol: 'Se',    name: 'Selenium',      mass: 78.971,   category: 'nonmetal',       period: 4,  group: 16, config: '[Ar] 3d¹⁰ 4s² 4p⁴',      state: 'solid',     discoverer: 'Jöns Jacob Berzelius (1817)' },
  { number: 35, symbol: 'Br',    name: 'Bromine',       mass: 79.904,   category: 'halogen',        period: 4,  group: 17, config: '[Ar] 3d¹⁰ 4s² 4p⁵',      state: 'liquid',    discoverer: 'Antoine Jérôme Balard (1826)' },
  { number: 36, symbol: 'Kr',    name: 'Krypton',       mass: 83.798,   category: 'noble-gas',      period: 4,  group: 18, config: '[Ar] 3d¹⁰ 4s² 4p⁶',      state: 'gas',       discoverer: 'William Ramsay & Morris Travers (1898)' },
  { number: 37, symbol: 'Rb',    name: 'Rubidium',      mass: 85.468,   category: 'alkali',         period: 5,  group: 1,  config: '[Kr] 5s¹',                state: 'solid',     discoverer: 'Robert Bunsen (1861)' },
  { number: 38, symbol: 'Sr',    name: 'Strontium',     mass: 87.62,    category: 'alkaline-earth', period: 5,  group: 2,  config: '[Kr] 5s²',                state: 'solid',     discoverer: 'Adair Crawford (1790)' },
  { number: 39, symbol: 'Y',     name: 'Yttrium',       mass: 88.906,   category: 'transition-metal',period: 5, group: 3,  config: '[Kr] 4d¹ 5s²',            state: 'solid',     discoverer: 'Johan Gadolin (1794)' },
  { number: 40, symbol: 'Zr',    name: 'Zirconium',     mass: 91.224,   category: 'transition-metal',period: 5, group: 4,  config: '[Kr] 4d² 5s²',            state: 'solid',     discoverer: 'Martin Heinrich Klaproth (1789)' },
  { number: 41, symbol: 'Nb',    name: 'Niobium',       mass: 92.906,   category: 'transition-metal',period: 5, group: 5,  config: '[Kr] 4d⁴ 5s¹',            state: 'solid',     discoverer: 'Charles Hatchett (1801)' },
  { number: 42, symbol: 'Mo',    name: 'Molybdenum',    mass: 95.95,    category: 'transition-metal',period: 5, group: 6,  config: '[Kr] 4d⁵ 5s¹',            state: 'solid',     discoverer: 'Carl Wilhelm Scheele (1778)' },
  { number: 43, symbol: 'Tc',    name: 'Technetium',    mass: 98.0,     category: 'transition-metal',period: 5, group: 7,  config: '[Kr] 4d⁵ 5s²',            state: 'synthetic', discoverer: 'Emilio Segrè (1937)' },
  { number: 44, symbol: 'Ru',    name: 'Ruthenium',     mass: 101.07,   category: 'transition-metal',period: 5, group: 8,  config: '[Kr] 4d⁷ 5s¹',            state: 'solid',     discoverer: 'Karl Ernst Claus (1844)' },
  { number: 45, symbol: 'Rh',    name: 'Rhodium',       mass: 102.91,   category: 'transition-metal',period: 5, group: 9,  config: '[Kr] 4d⁸ 5s¹',            state: 'solid',     discoverer: 'William Hyde Wollaston (1803)' },
  { number: 46, symbol: 'Pd',    name: 'Palladium',     mass: 106.42,   category: 'transition-metal',period: 5, group: 10, config: '[Kr] 4d¹⁰',               state: 'solid',     discoverer: 'William Hyde Wollaston (1803)' },
  { number: 47, symbol: 'Ag',    name: 'Silver',        mass: 107.87,   category: 'transition-metal',period: 5, group: 11, config: '[Kr] 4d¹⁰ 5s¹',           state: 'solid',     discoverer: 'Prehistoric' },
  { number: 48, symbol: 'Cd',    name: 'Cadmium',       mass: 112.41,   category: 'transition-metal',period: 5, group: 12, config: '[Kr] 4d¹⁰ 5s²',           state: 'solid',     discoverer: 'Karl Samuel Leberecht Hermann (1817)' },
  { number: 49, symbol: 'In',    name: 'Indium',        mass: 114.82,   category: 'post-transition',period: 5,  group: 13, config: '[Kr] 4d¹⁰ 5s² 5p¹',      state: 'solid',     discoverer: 'Ferdinand Reich & Richter (1863)' },
  { number: 50, symbol: 'Sn',    name: 'Tin',           mass: 118.71,   category: 'post-transition',period: 5,  group: 14, config: '[Kr] 4d¹⁰ 5s² 5p²',      state: 'solid',     discoverer: 'Ancient times' },
  { number: 51, symbol: 'Sb',    name: 'Antimony',      mass: 121.76,   category: 'metalloid',      period: 5,  group: 15, config: '[Kr] 4d¹⁰ 5s² 5p³',      state: 'solid',     discoverer: 'Prehistoric' },
  { number: 52, symbol: 'Te',    name: 'Tellurium',     mass: 127.6,    category: 'metalloid',      period: 5,  group: 16, config: '[Kr] 4d¹⁰ 5s² 5p⁴',      state: 'solid',     discoverer: 'Franz-Joseph Müller von Reichenstein (1782)' },
  { number: 53, symbol: 'I',     name: 'Iodine',        mass: 126.90,   category: 'halogen',        period: 5,  group: 17, config: '[Kr] 4d¹⁰ 5s² 5p⁵',      state: 'solid',     discoverer: 'Bernard Courtois (1811)' },
  { number: 54, symbol: 'Xe',    name: 'Xenon',         mass: 131.29,   category: 'noble-gas',      period: 5,  group: 18, config: '[Kr] 4d¹⁰ 5s² 5p⁶',      state: 'gas',       discoverer: 'William Ramsay (1898)' },
  { number: 55, symbol: 'Cs',    name: 'Cesium',        mass: 132.91,   category: 'alkali',         period: 6,  group: 1,  config: '[Xe] 6s¹',                state: 'solid',     discoverer: 'Robert Bunsen & Gustav Kirchhoff (1860)' },
  { number: 56, symbol: 'Ba',    name: 'Barium',        mass: 137.33,   category: 'alkaline-earth', period: 6,  group: 2,  config: '[Xe] 6s²',                state: 'solid',     discoverer: 'Carl Wilhelm Scheele (1772)' },
  { number: '57-71', symbol: 'La-Lu', name: 'Lanthanides', mass: '138.9-175.0', category: 'lanthanide', period: 6, group: 3, config: '[Xe] 4f⁰⁻¹⁴ 5d⁰⁻¹ 6s²', state: 'solid', discoverer: 'Various', isPlaceholder: true },
  { number: 72, symbol: 'Hf',    name: 'Hafnium',       mass: 178.49,   category: 'transition-metal',period: 6, group: 4,  config: '[Xe] 4f¹⁴ 5d² 6s²',       state: 'solid',     discoverer: 'Dirk Coster & George de Hevesy (1923)' },
  { number: 73, symbol: 'Ta',    name: 'Tantalum',      mass: 180.95,   category: 'transition-metal',period: 6, group: 5,  config: '[Xe] 4f¹⁴ 5d³ 6s²',       state: 'solid',     discoverer: 'Anders Gustaf Ekeberg (1802)' },
  { number: 74, symbol: 'W',     name: 'Tungsten',      mass: 183.84,   category: 'transition-metal',period: 6, group: 6,  config: '[Xe] 4f¹⁴ 5d⁴ 6s²',       state: 'solid',     discoverer: 'Carl Wilhelm Scheele (1781)' },
  { number: 75, symbol: 'Re',    name: 'Rhenium',       mass: 186.21,   category: 'transition-metal',period: 6, group: 7,  config: '[Xe] 4f¹⁴ 5d⁵ 6s²',       state: 'solid',     discoverer: 'Masataka Ogawa (1908)' },
  { number: 76, symbol: 'Os',    name: 'Osmium',        mass: 190.23,   category: 'transition-metal',period: 6, group: 8,  config: '[Xe] 4f¹⁴ 5d⁶ 6s²',       state: 'solid',     discoverer: 'Smithson Tennant (1803)' },
  { number: 77, symbol: 'Ir',    name: 'Iridium',       mass: 192.22,   category: 'transition-metal',period: 6, group: 9,  config: '[Xe] 4f¹⁴ 5d⁷ 6s²',       state: 'solid',     discoverer: 'Smithson Tennant (1803)' },
  { number: 78, symbol: 'Pt',    name: 'Platinum',      mass: 195.08,   category: 'transition-metal',period: 6, group: 10, config: '[Xe] 4f¹⁴ 5d⁹ 6s¹',       state: 'solid',     discoverer: 'Antonio de Ulloa (1735)' },
  { number: 79, symbol: 'Au',    name: 'Gold',          mass: 196.97,   category: 'transition-metal',period: 6, group: 11, config: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹',      state: 'solid',     discoverer: 'Prehistoric' },
  { number: 80, symbol: 'Hg',    name: 'Mercury',       mass: 200.59,   category: 'transition-metal',period: 6, group: 12, config: '[Xe] 4f¹⁴ 5d¹⁰ 6s²',      state: 'liquid',    discoverer: 'Prehistoric' },
  { number: 81, symbol: 'Tl',    name: 'Thallium',      mass: 204.38,   category: 'post-transition',period: 6,  group: 13, config: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹',  state: 'solid',     discoverer: 'William Crookes (1861)' },
  { number: 82, symbol: 'Pb',    name: 'Lead',          mass: 207.2,    category: 'post-transition',period: 6,  group: 14, config: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²',  state: 'solid',     discoverer: 'Prehistoric' },
  { number: 83, symbol: 'Bi',    name: 'Bismuth',       mass: 208.98,   category: 'post-transition',period: 6,  group: 15, config: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³',  state: 'solid',     discoverer: 'Claude François Geoffroy (1753)' },
  { number: 84, symbol: 'Po',    name: 'Polonium',      mass: 209.0,    category: 'post-transition',period: 6,  group: 16, config: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴',  state: 'solid',     discoverer: 'Marie & Pierre Curie (1898)' },
  { number: 85, symbol: 'At',    name: 'Astatine',      mass: 210.0,    category: 'metalloid',      period: 6,  group: 17, config: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵',  state: 'solid',     discoverer: 'Dale R. Corson (1940)' },
  { number: 86, symbol: 'Rn',    name: 'Radon',         mass: 222.0,    category: 'noble-gas',      period: 6,  group: 18, config: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶',  state: 'gas',       discoverer: 'Ernest Rutherford & Robert Owens (1899)' },
  { number: 87, symbol: 'Fr',    name: 'Francium',      mass: 223.0,    category: 'alkali',         period: 7,  group: 1,  config: '[Rn] 7s¹',                state: 'solid',     discoverer: 'Marguerite Perey (1939)' },
  { number: 88, symbol: 'Ra',    name: 'Radium',        mass: 226.0,    category: 'alkaline-earth', period: 7,  group: 2,  config: '[Rn] 7s²',                state: 'solid',     discoverer: 'Marie & Pierre Curie (1898)' },
  { number: '89-103', symbol: 'Ac-Lr', name: 'Actinides', mass: '227.0-262.0', category: 'actinide', period: 7, group: 3, config: '[Rn] 5f⁰⁻¹⁴ 6d⁰⁻² 7s²', state: 'solid/synthetic', discoverer: 'Various', isPlaceholder: true },
  { number: 104, symbol: 'Rf',   name: 'Rutherfordium', mass: 267.0,    category: 'transition-metal',period: 7, group: 4,  config: '[Rn] 5f¹⁴ 6d² 7s²',       state: 'synthetic', discoverer: 'JINR / Berkeley (1964)' },
  { number: 105, symbol: 'Db',   name: 'Dubnium',       mass: 268.0,    category: 'transition-metal',period: 7, group: 5,  config: '[Rn] 5f¹⁴ 6d³ 7s²',       state: 'synthetic', discoverer: 'JINR / Berkeley (1967)' },
  { number: 106, symbol: 'Sg',   name: 'Seaborgium',    mass: 271.0,    category: 'transition-metal',period: 7, group: 6,  config: '[Rn] 5f¹⁴ 6d⁴ 7s²',       state: 'synthetic', discoverer: 'Berkeley Lab (1974)' },
  { number: 107, symbol: 'Bh',   name: 'Bohrium',       mass: 272.0,    category: 'transition-metal',period: 7, group: 7,  config: '[Rn] 5f¹⁴ 6d⁵ 7s²',       state: 'synthetic', discoverer: 'GSI (1981)' },
  { number: 108, symbol: 'Hs',   name: 'Hassium',       mass: 270.0,    category: 'transition-metal',period: 7, group: 8,  config: '[Rn] 5f¹⁴ 6d⁶ 7s²',       state: 'synthetic', discoverer: 'GSI (1984)' },
  { number: 109, symbol: 'Mt',   name: 'Meitnerium',    mass: 276.0,    category: 'unknown',        period: 7,  group: 9,  config: '[Rn] 5f¹⁴ 6d⁷ 7s²',       state: 'synthetic', discoverer: 'GSI (1982)' },
  { number: 110, symbol: 'Ds',   name: 'Darmstadtium',  mass: 281.0,    category: 'unknown',        period: 7,  group: 10, config: '[Rn] 5f¹⁴ 6d⁸ 7s²',       state: 'synthetic', discoverer: 'GSI (1994)' },
  { number: 111, symbol: 'Rg',   name: 'Roentgenium',   mass: 280.0,    category: 'unknown',        period: 7,  group: 11, config: '[Rn] 5f¹⁴ 6d⁹ 7s²',       state: 'synthetic', discoverer: 'GSI (1994)' },
  { number: 112, symbol: 'Cn',   name: 'Copernicium',   mass: 285.0,    category: 'transition-metal',period: 7, group: 12, config: '[Rn] 5f¹⁴ 6d¹⁰ 7s²',      state: 'synthetic', discoverer: 'GSI (1996)' },
  { number: 113, symbol: 'Nh',   name: 'Nihonium',      mass: 284.0,    category: 'unknown',        period: 7,  group: 13, config: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹',  state: 'synthetic', discoverer: 'RIKEN (2003)' },
  { number: 114, symbol: 'Fl',   name: 'Flerovium',     mass: 289.0,    category: 'post-transition',period: 7,  group: 14, config: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²',  state: 'synthetic', discoverer: 'JINR (1998)' },
  { number: 115, symbol: 'Mc',   name: 'Moscovium',     mass: 288.0,    category: 'unknown',        period: 7,  group: 15, config: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³',  state: 'synthetic', discoverer: 'JINR / LLNL (2003)' },
  { number: 116, symbol: 'Lv',   name: 'Livermorium',   mass: 293.0,    category: 'unknown',        period: 7,  group: 16, config: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴',  state: 'synthetic', discoverer: 'JINR / LLNL (2000)' },
  { number: 117, symbol: 'Ts',   name: 'Tennessine',    mass: 294.0,    category: 'unknown',        period: 7,  group: 17, config: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵',  state: 'synthetic', discoverer: 'JINR / LLNL / ORNL (2010)' },
  { number: 118, symbol: 'Og',   name: 'Oganesson',     mass: 294.0,    category: 'unknown',        period: 7,  group: 18, config: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶',  state: 'synthetic', discoverer: 'JINR / LLNL (2002)' },
  // Lanthanides (Row 9, groups 4-18)
  { number: 57,  symbol: 'La',   name: 'Lanthanum',     mass: 138.91,   category: 'lanthanide',     period: 9,  group: 4,  config: '[Xe] 5d¹ 6s²',            state: 'solid',     discoverer: 'Carl Gustaf Mosander (1839)' },
  { number: 58,  symbol: 'Ce',   name: 'Cerium',        mass: 140.12,   category: 'lanthanide',     period: 9,  group: 5,  config: '[Xe] 4f¹ 5d¹ 6s²',        state: 'solid',     discoverer: 'Martin Heinrich Klaproth (1803)' },
  { number: 59,  symbol: 'Pr',   name: 'Praseodymium',  mass: 140.91,   category: 'lanthanide',     period: 9,  group: 6,  config: '[Xe] 4f³ 6s²',             state: 'solid',     discoverer: 'Carl Auer von Welsbach (1885)' },
  { number: 60,  symbol: 'Nd',   name: 'Neodymium',     mass: 144.24,   category: 'lanthanide',     period: 9,  group: 7,  config: '[Xe] 4f⁴ 6s²',             state: 'solid',     discoverer: 'Carl Auer von Welsbach (1885)' },
  { number: 61,  symbol: 'Pm',   name: 'Promethium',    mass: 145.0,    category: 'lanthanide',     period: 9,  group: 8,  config: '[Xe] 4f⁵ 6s²',             state: 'synthetic', discoverer: 'Chien Shiung Wu (1947)' },
  { number: 62,  symbol: 'Sm',   name: 'Samarium',      mass: 150.36,   category: 'lanthanide',     period: 9,  group: 9,  config: '[Xe] 4f⁶ 6s²',             state: 'solid',     discoverer: 'Paul-Émile Lecoq de Boisbaudran (1879)' },
  { number: 63,  symbol: 'Eu',   name: 'Europium',      mass: 151.96,   category: 'lanthanide',     period: 9,  group: 10, config: '[Xe] 4f⁷ 6s²',             state: 'solid',     discoverer: 'Eugène-Anatole Demarçay (1901)' },
  { number: 64,  symbol: 'Gd',   name: 'Gadolinium',    mass: 157.25,   category: 'lanthanide',     period: 9,  group: 11, config: '[Xe] 4f⁷ 5d¹ 6s²',        state: 'solid',     discoverer: 'Jean Charles Galissard de Marignac (1880)' },
  { number: 65,  symbol: 'Tb',   name: 'Terbium',       mass: 158.93,   category: 'lanthanide',     period: 9,  group: 12, config: '[Xe] 4f⁹ 6s²',             state: 'solid',     discoverer: 'Carl Gustaf Mosander (1843)' },
  { number: 66,  symbol: 'Dy',   name: 'Dysprosium',    mass: 162.50,   category: 'lanthanide',     period: 9,  group: 13, config: '[Xe] 4f¹⁰ 6s²',            state: 'solid',     discoverer: 'Paul-Émile Lecoq de Boisbaudran (1886)' },
  { number: 67,  symbol: 'Ho',   name: 'Holmium',       mass: 164.93,   category: 'lanthanide',     period: 9,  group: 14, config: '[Xe] 4f¹¹ 6s²',            state: 'solid',     discoverer: 'Marc Delafontaine & Jacques-Louis Soret (1878)' },
  { number: 68,  symbol: 'Er',   name: 'Erbium',        mass: 167.26,   category: 'lanthanide',     period: 9,  group: 15, config: '[Xe] 4f¹² 6s²',            state: 'solid',     discoverer: 'Carl Gustaf Mosander (1843)' },
  { number: 69,  symbol: 'Tm',   name: 'Thulium',       mass: 168.93,   category: 'lanthanide',     period: 9,  group: 16, config: '[Xe] 4f¹³ 6s²',            state: 'solid',     discoverer: 'Per Teodor Cleve (1879)' },
  { number: 70,  symbol: 'Yb',   name: 'Ytterbium',     mass: 173.05,   category: 'lanthanide',     period: 9,  group: 17, config: '[Xe] 4f¹⁴ 6s²',            state: 'solid',     discoverer: 'Jean Charles Galissard de Marignac (1878)' },
  { number: 71,  symbol: 'Lu',   name: 'Lutetium',      mass: 174.97,   category: 'lanthanide',     period: 9,  group: 18, config: '[Xe] 4f¹⁴ 5d¹ 6s²',       state: 'solid',     discoverer: 'Georges Urbain (1907)' },
  // Actinides (Row 10, groups 4-18)
  { number: 89,  symbol: 'Ac',   name: 'Actinium',      mass: 227.0,    category: 'actinide',       period: 10, group: 4,  config: '[Rn] 6d¹ 7s²',            state: 'solid',     discoverer: 'Friedrich Oskar Giesel (1902)' },
  { number: 90,  symbol: 'Th',   name: 'Thorium',       mass: 232.04,   category: 'actinide',       period: 10, group: 5,  config: '[Rn] 6d² 7s²',             state: 'solid',     discoverer: 'Jöns Jacob Berzelius (1829)' },
  { number: 91,  symbol: 'Pa',   name: 'Protactinium',  mass: 231.04,   category: 'actinide',       period: 10, group: 6,  config: '[Rn] 5f² 6d¹ 7s²',         state: 'solid',     discoverer: 'Lise Meitner & Otto Hahn (1917)' },
  { number: 92,  symbol: 'U',    name: 'Uranium',       mass: 238.03,   category: 'actinide',       period: 10, group: 7,  config: '[Rn] 5f³ 6d¹ 7s²',         state: 'solid',     discoverer: 'Martin Heinrich Klaproth (1789)' },
  { number: 93,  symbol: 'Np',   name: 'Neptunium',     mass: 237.0,    category: 'actinide',       period: 10, group: 8,  config: '[Rn] 5f⁴ 6d¹ 7s²',         state: 'synthetic', discoverer: 'Edwin McMillan & Philip Abelson (1940)' },
  { number: 94,  symbol: 'Pu',   name: 'Plutonium',     mass: 244.0,    category: 'actinide',       period: 10, group: 9,  config: '[Rn] 5f⁶ 7s²',             state: 'synthetic', discoverer: 'Glenn T. Seaborg (1940)' },
  { number: 95,  symbol: 'Am',   name: 'Americium',     mass: 243.0,    category: 'actinide',       period: 10, group: 10, config: '[Rn] 5f⁷ 7s²',             state: 'synthetic', discoverer: 'Glenn T. Seaborg (1944)' },
  { number: 96,  symbol: 'Cm',   name: 'Curium',        mass: 247.0,    category: 'actinide',       period: 10, group: 11, config: '[Rn] 5f⁷ 6d¹ 7s²',         state: 'synthetic', discoverer: 'Glenn T. Seaborg (1944)' },
  { number: 97,  symbol: 'Bk',   name: 'Berkelium',     mass: 247.0,    category: 'actinide',       period: 10, group: 12, config: '[Rn] 5f⁹ 7s²',             state: 'synthetic', discoverer: 'Glenn T. Seaborg (1949)' },
  { number: 98,  symbol: 'Cf',   name: 'Californium',   mass: 251.0,    category: 'actinide',       period: 10, group: 13, config: '[Rn] 5f¹⁰ 7s²',            state: 'synthetic', discoverer: 'Glenn T. Seaborg (1950)' },
  { number: 99,  symbol: 'Es',   name: 'Einsteinium',   mass: 252.0,    category: 'actinide',       period: 10, group: 14, config: '[Rn] 5f¹¹ 7s²',            state: 'synthetic', discoverer: 'Albert Ghiorso (1952)' },
  { number: 100, symbol: 'Fm',   name: 'Fermium',       mass: 257.0,    category: 'actinide',       period: 10, group: 15, config: '[Rn] 5f¹² 7s²',            state: 'synthetic', discoverer: 'Albert Ghiorso (1952)' },
  { number: 101, symbol: 'Md',   name: 'Mendelevium',   mass: 258.0,    category: 'actinide',       period: 10, group: 16, config: '[Rn] 5f¹³ 7s²',            state: 'synthetic', discoverer: 'Albert Ghiorso (1955)' },
  { number: 102, symbol: 'No',   name: 'Nobelium',      mass: 259.0,    category: 'actinide',       period: 10, group: 17, config: '[Rn] 5f¹⁴ 7s²',            state: 'synthetic', discoverer: 'Nobel Institute for Physics (1957)' },
  { number: 103, symbol: 'Lr',   name: 'Lawrencium',    mass: 262.0,    category: 'actinide',       period: 10, group: 18, config: '[Rn] 5f¹⁴ 6d¹ 7s²',        state: 'synthetic', discoverer: 'Albert Ghiorso (1961)' }
];

// ─── ENRICHED PROPERTY DATA (keyed by atomic number) ────────────────────────
// mp = meltingPoint (K), bp = boilingPoint (K)
const ELEM_EXTRA = {
  1:   { mp:14.01,    bp:20.28,    density:'0.0899 g/L',   en:2.20,  ar:53,   ie:13.598, ea:0.754,  ox:'+1, −1',          cas:'1333-74-0',  block:'s', yr:'1766',      origin:'Greek hydro+genes (water-forming)',       uses:['Fuel cells & hydrogen vehicles','Ammonia production for fertilizers','Rocket propellant (liquid H₂)'], shells:[1] },
  2:   { mp:0.95,     bp:4.22,     density:'0.1786 g/L',   en:null,  ar:31,   ie:24.587, ea:0,      ox:'0',               cas:'7440-59-7',  block:'s', yr:'1868',      origin:'Greek Helios (the Sun)',                  uses:['Balloons & airships','Cryogenic cooling of MRI magnets','Pressurizing spacecraft fuel tanks'], shells:[2] },
  3:   { mp:453.69,   bp:1560,     density:'0.534 g/cm³',  en:0.98,  ar:167,  ie:5.392,  ea:0.618,  ox:'+1',              cas:'7439-93-2',  block:'s', yr:'1817',      origin:'Greek lithos (stone)',                    uses:['Lithium-ion batteries','Psychiatric medicine (Li₂CO₃)','Lightweight aerospace alloys'], shells:[2,1] },
  4:   { mp:1560,     bp:2742,     density:'1.85 g/cm³',   en:1.57,  ar:112,  ie:9.323,  ea:0,      ox:'+2',              cas:'7440-41-7',  block:'s', yr:'1798',      origin:'Greek beryllos (the beryl mineral)',       uses:['X-ray transparent windows','Aerospace structural alloys','Nuclear reactor reflectors'], shells:[2,2] },
  5:   { mp:2349,     bp:4200,     density:'2.34 g/cm³',   en:2.04,  ar:87,   ie:8.298,  ea:0.277,  ox:'+3',              cas:'7440-42-8',  block:'p', yr:'1808',      origin:'Arabic buraq (borax)',                    uses:['Borosilicate glass (Pyrex)','Semiconductor dopants','Neutron-absorbing control rods'], shells:[2,3] },
  6:   { mp:3823,     bp:4300,     density:'2.267 g/cm³',  en:2.55,  ar:77,   ie:11.260, ea:1.262,  ox:'+4, +2, −4',     cas:'7440-44-0',  block:'p', yr:'Prehistoric',origin:'Latin carbo (charcoal)',                   uses:['Steel & iron production','Fossil fuels & energy','Diamond tools & electronics'], shells:[2,4] },
  7:   { mp:63.15,    bp:77.36,    density:'1.251 g/L',    en:3.04,  ar:75,   ie:14.534, ea:0,      ox:'+5,+3,+2,+1,−3', cas:'7727-37-9',  block:'p', yr:'1772',      origin:'Greek nitron+genes (nitre-forming)',       uses:['Nitrogen fertilizers (Haber process)','Liquid nitrogen cryogenic cooling','Explosives & propellants'], shells:[2,5] },
  8:   { mp:54.36,    bp:90.19,    density:'1.429 g/L',    en:3.44,  ar:73,   ie:13.618, ea:1.461,  ox:'−2, −1',         cas:'7782-44-7',  block:'p', yr:'1774',      origin:'Greek oxys+genes (acid-forming)',          uses:['Respiratory medicine & life support','Steel & glass production','Rocket oxidizer'], shells:[2,6] },
  9:   { mp:53.53,    bp:85.03,    density:'1.696 g/L',    en:3.98,  ar:64,   ie:17.423, ea:3.339,  ox:'−1',              cas:'7782-41-4',  block:'p', yr:'1886',      origin:'Latin fluere (to flow)',                  uses:['Fluoride in toothpaste','Teflon & fluoropolymers','Uranium enrichment (UF₆)'], shells:[2,7] },
  10:  { mp:24.56,    bp:27.07,    density:'0.900 g/L',    en:null,  ar:38,   ie:21.565, ea:0,      ox:'0',               cas:'7440-01-9',  block:'p', yr:'1898',      origin:'Greek neos (new)',                         uses:['Neon signs & plasma displays','Cryogenic research','High-voltage indicators'], shells:[2,8] },
  11:  { mp:370.95,   bp:1156,     density:'0.968 g/cm³',  en:0.93,  ar:190,  ie:5.139,  ea:0.548,  ox:'+1',              cas:'7440-23-5',  block:'s', yr:'1807',      origin:'English soda; Latin Natrium',             uses:['Table salt (NaCl)','Sodium-vapor street lights','Chemical reagent in industry'], shells:[2,8,1] },
  12:  { mp:923,      bp:1363,     density:'1.738 g/cm³',  en:1.31,  ar:145,  ie:7.646,  ea:0,      ox:'+2',              cas:'7439-95-4',  block:'s', yr:'1755',      origin:'Magnesia district, Greece',               uses:['Lightweight aircraft & car alloys','Fireworks & flares','Antacid medicines'], shells:[2,8,2] },
  13:  { mp:933.47,   bp:2792,     density:'2.70 g/cm³',   en:1.61,  ar:118,  ie:5.986,  ea:0.432,  ox:'+3',              cas:'7429-90-5',  block:'p', yr:'1825',      origin:'Latin alumen (alum salt)',                uses:['Beverage cans & packaging','Aircraft & vehicle parts','Electrical power lines'], shells:[2,8,3] },
  14:  { mp:1687,     bp:3538,     density:'2.329 g/cm³',  en:1.90,  ar:111,  ie:8.151,  ea:1.385,  ox:'+4, −4',         cas:'7440-21-3',  block:'p', yr:'1824',      origin:'Latin silex (flint)',                     uses:['Microchips & semiconductors','Solar photovoltaic cells','Glass & concrete'], shells:[2,8,4] },
  15:  { mp:317.3,    bp:553.7,    density:'1.823 g/cm³',  en:2.19,  ar:98,   ie:10.486, ea:0.746,  ox:'+5,+3,−3',       cas:'7723-14-0',  block:'p', yr:'1669',      origin:'Greek phosphoros (light-bearer)',          uses:['Fertilizers (phosphate)','Matches & safety explosives','DNA & RNA backbone'], shells:[2,8,5] },
  16:  { mp:388.36,   bp:717.8,    density:'2.067 g/cm³',  en:2.58,  ar:103,  ie:10.360, ea:2.077,  ox:'+6,+4,−2',       cas:'7704-34-9',  block:'p', yr:'Prehistoric',origin:'Latin sulphur',                            uses:['Sulfuric acid (H₂SO₄) production','Rubber vulcanization','Fungicides & pesticides'], shells:[2,8,6] },
  17:  { mp:171.65,   bp:239.11,   density:'3.214 g/L',    en:3.16,  ar:99,   ie:12.968, ea:3.617,  ox:'+7,+5,+3,+1,−1', cas:'7782-50-5', block:'p', yr:'1774',      origin:'Greek chloros (greenish-yellow)',          uses:['Water disinfection & purification','PVC plastic production','Bleach & cleaning agents'], shells:[2,8,7] },
  18:  { mp:83.80,    bp:87.30,    density:'1.784 g/L',    en:null,  ar:71,   ie:15.760, ea:0,      ox:'0',               cas:'7440-37-1',  block:'p', yr:'1894',      origin:'Greek argos (idle/lazy)',                  uses:['Inert welding shielding gas','Incandescent & fluorescent light bulbs','Geochronology dating'], shells:[2,8,8] },
  19:  { mp:336.53,   bp:1032,     density:'0.862 g/cm³',  en:0.82,  ar:243,  ie:4.341,  ea:0.501,  ox:'+1',              cas:'7440-09-7',  block:'s', yr:'1807',      origin:'English potash; Latin Kalium',            uses:['Agricultural fertilizers','Gunpowder (KNO₃)','Potassium-ion nutrition'], shells:[2,8,8,1] },
  20:  { mp:1115,     bp:1757,     density:'1.55 g/cm³',   en:1.00,  ar:194,  ie:6.113,  ea:0.025,  ox:'+2',              cas:'7440-70-2',  block:'s', yr:'1808',      origin:'Latin calx (lime)',                       uses:['Cement & concrete construction','Bone & tooth structure in organisms','Steel production as flux'], shells:[2,8,8,2] },
  21:  { mp:1814,     bp:3109,     density:'2.985 g/cm³',  en:1.36,  ar:184,  ie:6.561,  ea:0.188,  ox:'+3',              cas:'7440-20-2',  block:'d', yr:'1879',      origin:'Latin Scandia (Scandinavia)',              uses:['Aerospace high-strength alloys','Sports equipment (bicycle frames)','Mercury-vapor lamps'], shells:[2,8,9,2] },
  22:  { mp:1941,     bp:3560,     density:'4.507 g/cm³',  en:1.54,  ar:176,  ie:6.828,  ea:0.079,  ox:'+4,+3,+2',       cas:'7440-32-6',  block:'d', yr:'1791',      origin:'Greek Titans (mythological giants)',       uses:['Aerospace structural alloys','Biomedical implants & prosthetics','White pigment TiO₂'], shells:[2,8,10,2] },
  23:  { mp:2183,     bp:3680,     density:'6.11 g/cm³',   en:1.63,  ar:171,  ie:6.746,  ea:0.525,  ox:'+5,+4,+3,+2',   cas:'7440-62-2',  block:'d', yr:'1801',      origin:'Norse Vanadis (Freya, goddess)',           uses:['High-strength steel alloys','Vanadium redox flow batteries','Chemical catalysts'], shells:[2,8,11,2] },
  24:  { mp:2180,     bp:2944,     density:'7.15 g/cm³',   en:1.66,  ar:166,  ie:6.767,  ea:0.666,  ox:'+6,+3,+2',       cas:'7440-47-3',  block:'d', yr:'1797',      origin:'Greek chroma (color)',                    uses:['Stainless steel & corrosion protection','Decorative chrome plating','Tanning of leather'], shells:[2,8,13,1] },
  25:  { mp:1519,     bp:2334,     density:'7.21 g/cm³',   en:1.55,  ar:161,  ie:7.434,  ea:0,      ox:'+7,+4,+2',       cas:'7439-96-5',  block:'d', yr:'1774',      origin:'Latin Magnesia (district in Greece)',      uses:['Steel production (desulfurizer)','Dry-cell battery electrodes','Fertilizer micronutrients'], shells:[2,8,13,2] },
  26:  { mp:1811,     bp:3134,     density:'7.874 g/cm³',  en:1.83,  ar:156,  ie:7.902,  ea:0.151,  ox:'+3,+2',          cas:'7439-89-6',  block:'d', yr:'Prehistoric',origin:'Anglo-Saxon iron; Latin Ferrum',           uses:['Structural steel & construction','Hemoglobin (oxygen transport in blood)','Cast iron & machinery'], shells:[2,8,14,2] },
  27:  { mp:1768,     bp:3200,     density:'8.90 g/cm³',   en:1.88,  ar:152,  ie:7.881,  ea:0.662,  ox:'+3,+2',          cas:'7440-48-4',  block:'d', yr:'1735',      origin:'German Kobold (goblin in mining folklore)',uses:['Lithium-ion battery cathodes','Jet engine superalloys','Permanent magnets'], shells:[2,8,15,2] },
  28:  { mp:1728,     bp:3186,     density:'8.908 g/cm³',  en:1.91,  ar:149,  ie:7.640,  ea:1.156,  ox:'+2,+3',          cas:'7440-02-0',  block:'d', yr:'1751',      origin:'German Nickel (demon in copper folklore)', uses:['Stainless steel alloying element','Nickel-metal hydride batteries','Coin alloys (e.g. US 5¢)'], shells:[2,8,16,2] },
  29:  { mp:1357.77,  bp:2835,     density:'8.96 g/cm³',   en:1.90,  ar:145,  ie:7.727,  ea:1.228,  ox:'+2,+1',          cas:'7440-50-8',  block:'d', yr:'Prehistoric',origin:'Latin Cuprum (island of Cyprus)',          uses:['Electrical wiring & conductors','Plumbing pipes & fittings','Bronze & brass alloys'], shells:[2,8,18,1] },
  30:  { mp:692.88,   bp:1180,     density:'7.14 g/cm³',   en:1.65,  ar:142,  ie:9.394,  ea:0,      ox:'+2',              cas:'7440-66-6',  block:'d', yr:'1746',      origin:'German Zink (fork-like crystals)',         uses:['Galvanizing steel to prevent rust','Brass alloy production','Zinc oxide in sunscreen'], shells:[2,8,18,2] },
  31:  { mp:302.91,   bp:2477,     density:'5.91 g/cm³',   en:1.81,  ar:136,  ie:5.999,  ea:0.43,   ox:'+3',              cas:'7440-55-3',  block:'p', yr:'1875',      origin:'Latin Gallia (France)',                   uses:['Semiconductors (GaAs for LEDs)','Solar cell materials','Low-melting metal alloys'], shells:[2,8,18,3] },
  32:  { mp:1211.4,   bp:3106,     density:'5.323 g/cm³',  en:2.01,  ar:125,  ie:7.900,  ea:1.233,  ox:'+4,+2',          cas:'7440-56-4',  block:'p', yr:'1886',      origin:'Latin Germania (Germany)',                uses:['Optical fiber & infrared optics','Early transistors & semiconductors','Gamma-ray detectors'], shells:[2,8,18,4] },
  33:  { mp:1090,     bp:887,      density:'5.727 g/cm³',  en:2.18,  ar:114,  ie:9.815,  ea:0.814,  ox:'+5,+3,−3',       cas:'7440-38-2',  block:'p', yr:'1250',      origin:'Greek arsenikon (yellow orpiment mineral)',uses:['Gallium arsenide semiconductors','Wood preservatives (CCA)','Pesticides & herbicides'], shells:[2,8,18,5] },
  34:  { mp:494,      bp:958,      density:'4.81 g/cm³',   en:2.55,  ar:103,  ie:9.752,  ea:2.021,  ox:'+6,+4,−2',       cas:'7782-49-2',  block:'p', yr:'1817',      origin:'Greek Selene (the Moon)',                 uses:['Thin-film solar cells (CdTe/CIGS)','Glass decolorizing & coloring','Photocopier drums'], shells:[2,8,18,6] },
  35:  { mp:265.8,    bp:332.0,    density:'3.122 g/cm³',  en:2.96,  ar:114,  ie:11.814, ea:3.364,  ox:'+5,+3,+1,−1',   cas:'7726-95-6',  block:'p', yr:'1826',      origin:'Greek bromos (stench)',                   uses:['Flame retardants in electronics','Photographic film (AgBr)','Pharmaceuticals & medicines'], shells:[2,8,18,7] },
  36:  { mp:115.79,   bp:119.93,   density:'3.749 g/L',    en:3.00,  ar:88,   ie:13.999, ea:0,      ox:'0',               cas:'7439-90-9',  block:'p', yr:'1898',      origin:'Greek kryptos (hidden)',                  uses:['Fluorescent lighting tubes','High-powered lasers','Photography flash lamps'], shells:[2,8,18,8] },
  37:  { mp:312.46,   bp:961,      density:'1.532 g/cm³',  en:0.82,  ar:265,  ie:4.177,  ea:0.486,  ox:'+1',              cas:'7440-17-7',  block:'s', yr:'1861',      origin:'Latin rubidus (deep red spectral lines)',  uses:['Atomic clocks (GPS & telecom)','Research in quantum optics','Fireworks (violet/red)'], shells:[2,8,18,8,1] },
  38:  { mp:1050,     bp:1655,     density:'2.64 g/cm³',   en:0.95,  ar:219,  ie:5.695,  ea:0.052,  ox:'+2',              cas:'7440-24-6',  block:'s', yr:'1790',      origin:'Strontian village, Scotland',             uses:['Red color in fireworks & flares','Bone-seeking isotopes for medical imaging','Glow-in-dark paints (historical)'], shells:[2,8,18,8,2] },
  39:  { mp:1799,     bp:3609,     density:'4.47 g/cm³',   en:1.22,  ar:212,  ie:6.217,  ea:0.307,  ox:'+3',              cas:'7440-65-5',  block:'d', yr:'1794',      origin:'Ytterby village, Sweden',                uses:['Camera & telescope lenses (Y₂O₃)','Yttrium-aluminum-garnet lasers (YAG)','Phosphors in LED screens'], shells:[2,8,18,9,2] },
  40:  { mp:2128,     bp:4682,     density:'6.52 g/cm³',   en:1.33,  ar:206,  ie:6.634,  ea:0.426,  ox:'+4',              cas:'7440-67-7',  block:'d', yr:'1789',      origin:'Arabic zargun (gold-colored like zircon)', uses:['Nuclear fuel rod cladding','High-temperature ceramics','Surgical implants & joint replacements'], shells:[2,8,18,10,2] },
  41:  { mp:2750,     bp:5017,     density:'8.57 g/cm³',   en:1.60,  ar:198,  ie:6.759,  ea:0.916,  ox:'+5,+3',          cas:'7440-03-1',  block:'d', yr:'1801',      origin:'Greek Niobe (daughter of Tantalus)',       uses:['High-strength steel alloys for pipelines','Superconducting MRI magnets','Jet engine components'], shells:[2,8,18,12,1] },
  42:  { mp:2896,     bp:4912,     density:'10.28 g/cm³',  en:2.16,  ar:190,  ie:7.092,  ea:0.748,  ox:'+6,+4',          cas:'7439-98-7',  block:'d', yr:'1778',      origin:'Greek molybdos (lead-like appearance)',    uses:['High-strength steel alloys','Aircraft engine turbines','Solid lubricant (MoS₂)'], shells:[2,8,18,13,1] },
  43:  { mp:2430,     bp:4538,     density:'11.0 g/cm³',   en:1.90,  ar:183,  ie:7.280,  ea:0.55,   ox:'+7,+4',          cas:'7440-26-8',  block:'d', yr:'1937',      origin:'Greek technetos (artificial/man-made)',    uses:['Nuclear medicine imaging (Tc-99m)','Corrosion inhibitor in steel','Radiotracer in research'], shells:[2,8,18,13,2] },
  44:  { mp:2607,     bp:4423,     density:'12.45 g/cm³',  en:2.20,  ar:178,  ie:7.361,  ea:1.05,   ox:'+8,+4,+3',       cas:'7440-18-8',  block:'d', yr:'1844',      origin:'Latin Ruthenia (Russia)',                 uses:['Platinum alloy hardening for jewelry','Electrical contact coatings','Catalysts for fuel cells'], shells:[2,8,18,15,1] },
  45:  { mp:2237,     bp:3968,     density:'12.41 g/cm³',  en:2.28,  ar:173,  ie:7.459,  ea:1.137,  ox:'+3,+1',          cas:'7440-16-6',  block:'d', yr:'1803',      origin:'Greek rhodon (rose; rose-red color of salts)',uses:['Three-way catalytic converters','Jewelry plating (bright finish)','Fiber optic connectors'], shells:[2,8,18,16,1] },
  46:  { mp:1828.05,  bp:3236,     density:'12.023 g/cm³', en:2.20,  ar:169,  ie:8.337,  ea:0.562,  ox:'+4,+2',          cas:'7440-05-3',  block:'d', yr:'1803',      origin:'Asteroid Pallas (discovered same year)',   uses:['Catalytic converters (petrol engines)','Hydrogen purification membranes','Dental alloys & crowns'], shells:[2,8,18,18,0] },
  47:  { mp:1234.93,  bp:2435,     density:'10.49 g/cm³',  en:1.93,  ar:165,  ie:7.576,  ea:1.302,  ox:'+1',              cas:'7440-22-4',  block:'d', yr:'Prehistoric',origin:'Anglo-Saxon seolfor; Latin Argentum',      uses:['Jewelry & silverware','Photographic emulsions (AgBr)','Antibacterial medical surfaces'], shells:[2,8,18,18,1] },
  48:  { mp:594.22,   bp:1040,     density:'8.65 g/cm³',   en:1.69,  ar:161,  ie:8.994,  ea:0,      ox:'+2',              cas:'7440-43-9',  block:'d', yr:'1817',      origin:'Latin cadmia (calamine ore)',             uses:['Nickel-cadmium rechargeable batteries','Nuclear reactor control rods','Yellow/orange pigments'], shells:[2,8,18,18,2] },
  49:  { mp:429.75,   bp:2345,     density:'7.31 g/cm³',   en:1.78,  ar:156,  ie:5.786,  ea:0.300,  ox:'+3',              cas:'7440-74-6',  block:'p', yr:'1863',      origin:'Indigo-colored spectral emission lines',  uses:['ITO for LCD & touch screens','Solders & low-melting alloys','Semiconductor thin films'], shells:[2,8,18,18,3] },
  50:  { mp:505.08,   bp:2875,     density:'7.365 g/cm³',  en:1.96,  ar:145,  ie:7.344,  ea:1.112,  ox:'+4,+2',          cas:'7440-31-5',  block:'p', yr:'Prehistoric',origin:'Anglo-Saxon tin; Latin Stannum',           uses:['Tin cans (food packaging)','Electronic solder alloys','Bronze (Cu-Sn) production'], shells:[2,8,18,18,4] },
  51:  { mp:903.78,   bp:1908,     density:'6.697 g/cm³',  en:2.05,  ar:133,  ie:8.608,  ea:1.047,  ox:'+5,+3,−3',       cas:'7440-36-0',  block:'p', yr:'Prehistoric',origin:'Latin Antimonium (via Arabic)',            uses:['Lead-acid battery plates (Pb-Sb)','Flame retardants in plastics','Semiconductor diodes'], shells:[2,8,18,18,5] },
  52:  { mp:722.66,   bp:1261,     density:'6.24 g/cm³',   en:2.10,  ar:123,  ie:9.010,  ea:1.971,  ox:'+6,+4,−2',       cas:'13494-80-9', block:'p', yr:'1782',      origin:'Latin tellus (Earth)',                    uses:['CdTe thin-film solar cells','Thermoelectric devices','Bismuth telluride cooling modules'], shells:[2,8,18,18,6] },
  53:  { mp:386.85,   bp:457.4,    density:'4.933 g/cm³',  en:2.66,  ar:115,  ie:10.451, ea:3.059,  ox:'+7,+5,+1,−1',   cas:'7553-56-2',  block:'p', yr:'1811',      origin:'Greek ioeides (violet color)',            uses:['Antiseptics (povidone-iodine)','Thyroid disease treatment (radioiodine)','Photography & dyes'], shells:[2,8,18,18,7] },
  54:  { mp:161.4,    bp:165.03,   density:'5.894 g/L',    en:2.60,  ar:108,  ie:12.130, ea:0,      ox:'0,+2,+4,+6',     cas:'7440-63-3',  block:'p', yr:'1898',      origin:'Greek xenos (stranger/foreigner)',         uses:['Xenon flash & arc lamps','General anesthetic gas','Ion thrusters for spacecraft'], shells:[2,8,18,18,8] },
  55:  { mp:301.59,   bp:944,      density:'1.873 g/cm³',  en:0.79,  ar:298,  ie:3.894,  ea:0.472,  ox:'+1',              cas:'7440-46-2',  block:'s', yr:'1860',      origin:'Latin caesius (sky blue spectral lines)',  uses:['Atomic clocks (GPS accuracy)','Oil well drilling fluids','Night-vision photocathodes'], shells:[2,8,18,18,8,1] },
  56:  { mp:1000,     bp:2170,     density:'3.51 g/cm³',   en:0.89,  ar:253,  ie:5.212,  ea:0.14,   ox:'+2',              cas:'7440-39-3',  block:'s', yr:'1808',      origin:'Greek barys (heavy)',                     uses:['Green-colored fireworks','Oil & gas drilling mud','X-ray & CT scan contrast agent'], shells:[2,8,18,18,8,2] },
  57:  { mp:1193,     bp:3737,     density:'6.162 g/cm³',  en:1.10,  ar:240,  ie:5.577,  ea:0.500,  ox:'+3',              cas:'7439-91-0',  block:'f', yr:'1839',      origin:'Greek lanthanein (to lie hidden)',         uses:['High-refractive camera lenses','Hydrogen storage alloys','Mischmetal for lighter flints'], shells:[2,8,18,18,9,2] },
  58:  { mp:1068,     bp:3716,     density:'6.77 g/cm³',   en:1.12,  ar:235,  ie:5.539,  ea:0.500,  ox:'+4,+3',          cas:'7440-45-1',  block:'f', yr:'1803',      origin:'Asteroid Ceres (discovered same year)',    uses:['Catalytic converter washcoat','Glass polishing & decolorizing','Lighter flints (mischmetal)'], shells:[2,8,18,19,9,2] },
  59:  { mp:1208,     bp:3793,     density:'6.77 g/cm³',   en:1.13,  ar:239,  ie:5.473,  ea:0.500,  ox:'+3,+4',          cas:'7440-10-0',  block:'f', yr:'1885',      origin:'Greek prasios+didymos (green twin)',       uses:['Powerful NdPr magnets for EVs','Fiber optic amplifiers (Er:YAG)','Protective goggles for glassblowing'], shells:[2,8,18,21,8,2] },
  60:  { mp:1297,     bp:3347,     density:'7.01 g/cm³',   en:1.14,  ar:229,  ie:5.525,  ea:0.500,  ox:'+3',              cas:'7440-00-8',  block:'f', yr:'1885',      origin:'Greek neos+didymos (new twin)',            uses:['Strongest permanent magnets (NdFeB)','High-power lasers','Purple-colored glass'], shells:[2,8,18,22,8,2] },
  61:  { mp:1315,     bp:3273,     density:'7.26 g/cm³',   en:1.13,  ar:236,  ie:5.582,  ea:0.500,  ox:'+3',              cas:'7440-12-2',  block:'f', yr:'1945',      origin:'Greek Prometheus (mythological Titan)',    uses:['Betavoltaic nuclear batteries','Thickness & density gauges','Research only (all isotopes radioactive)'], shells:[2,8,18,23,8,2] },
  62:  { mp:1345,     bp:2173,     density:'7.52 g/cm³',   en:1.17,  ar:229,  ie:5.644,  ea:0.500,  ox:'+3,+2',          cas:'7440-19-9',  block:'f', yr:'1879',      origin:'Mineral samarskite (named after Col. Samarski)',uses:['Samarium-cobalt permanent magnets','Neutron-absorber in nuclear reactors','Cancer treatment (Sm-153)'], shells:[2,8,18,24,8,2] },
  63:  { mp:1099,     bp:1802,     density:'5.264 g/cm³',  en:1.20,  ar:233,  ie:5.670,  ea:0.500,  ox:'+3,+2',          cas:'7440-53-1',  block:'f', yr:'1901',      origin:'Europa (the continent)',                  uses:['Red phosphors in TV & LED screens','Euro banknote anti-counterfeiting','Activated lasers (Eu-doped)'], shells:[2,8,18,25,8,2] },
  64:  { mp:1585,     bp:3523,     density:'7.90 g/cm³',   en:1.20,  ar:237,  ie:6.150,  ea:0.500,  ox:'+3',              cas:'7440-54-2',  block:'f', yr:'1880',      origin:'Chemist Johan Gadolin',                   uses:['MRI contrast agents (Gd-chelates)','Neutron radiography shielding','High-efficiency magnets'], shells:[2,8,18,25,9,2] },
  65:  { mp:1629,     bp:3503,     density:'8.23 g/cm³',   en:1.20,  ar:221,  ie:5.864,  ea:0.500,  ox:'+3,+4',          cas:'7440-27-9',  block:'f', yr:'1843',      origin:'Ytterby village, Sweden',                uses:['Green phosphors in solid-state devices','Terfenol-D magnetostrictive alloys','Fuel cell catalysts'], shells:[2,8,18,27,8,2] },
  66:  { mp:1680,     bp:2840,     density:'8.55 g/cm³',   en:1.22,  ar:229,  ie:5.939,  ea:0.500,  ox:'+3',              cas:'7429-91-6',  block:'f', yr:'1886',      origin:'Greek dysprositos (hard to obtain)',       uses:['NdFeB magnet additive for high-temp use','Laser materials','Nuclear reactor control rods'], shells:[2,8,18,28,8,2] },
  67:  { mp:1734,     bp:2993,     density:'8.80 g/cm³',   en:1.23,  ar:216,  ie:6.022,  ea:0.500,  ox:'+3',              cas:'7440-60-0',  block:'f', yr:'1878',      origin:'Latin Holmia (Stockholm)',                uses:['Strongest known magnetic moment (Ho compound)','Nuclear reactor control rods','Microwave equipment'], shells:[2,8,18,29,8,2] },
  68:  { mp:1802,     bp:3141,     density:'9.07 g/cm³',   en:1.24,  ar:235,  ie:6.108,  ea:0.500,  ox:'+3',              cas:'7440-52-0',  block:'f', yr:'1843',      origin:'Ytterby village, Sweden',                uses:['Erbium-doped fiber optic amplifiers','1550 nm surgical lasers','Pink color in glass/crystals'], shells:[2,8,18,30,8,2] },
  69:  { mp:1818,     bp:2223,     density:'9.32 g/cm³',   en:1.25,  ar:227,  ie:6.184,  ea:0.500,  ox:'+3,+2',          cas:'7440-30-4',  block:'f', yr:'1879',      origin:'Greek Thule (far north of Scandinavia)',   uses:['Portable X-ray sources (Tm-170)','Surgical lasers (2 µm wavelength)','Rare research material'], shells:[2,8,18,31,8,2] },
  70:  { mp:1097,     bp:1469,     density:'6.90 g/cm³',   en:1.10,  ar:242,  ie:6.254,  ea:0.500,  ox:'+3,+2',          cas:'7440-64-4',  block:'f', yr:'1878',      origin:'Ytterby village, Sweden',                uses:['Optical atomic clocks','Mechanical stress-strain gauges','Dopant in erbium fiber amplifiers'], shells:[2,8,18,32,8,2] },
  71:  { mp:1925,     bp:3675,     density:'9.841 g/cm³',  en:1.27,  ar:221,  ie:5.426,  ea:0.500,  ox:'+3',              cas:'7439-94-3',  block:'d', yr:'1907',      origin:'Latin Lutetia (Paris, France)',            uses:['PET scan detector crystals','Petroleum cracking catalysts','High-refractive-index glass'], shells:[2,8,18,32,9,2] },
  72:  { mp:2506,     bp:4876,     density:'13.31 g/cm³',  en:1.30,  ar:208,  ie:6.825,  ea:0,      ox:'+4',              cas:'7440-58-6',  block:'d', yr:'1923',      origin:'Latin Hafnia (Copenhagen, Denmark)',       uses:['Nuclear reactor control rods','Gate dielectric in CMOS transistors','Superalloys for jet engines'], shells:[2,8,18,32,10,2] },
  73:  { mp:3290,     bp:5731,     density:'16.69 g/cm³',  en:1.50,  ar:200,  ie:7.549,  ea:0.322,  ox:'+5',              cas:'7440-25-7',  block:'d', yr:'1802',      origin:'Greek Tantalos (mythological king, tantalizing)',uses:['Electrolytic capacitors in electronics','Surgical implants & bone repair','Cutting tool carbides'], shells:[2,8,18,32,11,2] },
  74:  { mp:3695,     bp:5828,     density:'19.3 g/cm³',   en:2.36,  ar:193,  ie:7.864,  ea:0.815,  ox:'+6,+4',          cas:'7440-33-7',  block:'d', yr:'1783',      origin:'Swedish tung sten (heavy stone)',          uses:['Incandescent light bulb filaments','Carbide cutting & drilling tools','Radiation shielding'], shells:[2,8,18,32,12,2] },
  75:  { mp:3459,     bp:5869,     density:'21.02 g/cm³',  en:1.90,  ar:188,  ie:7.833,  ea:0.150,  ox:'+7,+4',          cas:'7440-15-5',  block:'d', yr:'1925',      origin:'Latin Rhenus (Rhine River, Germany)',      uses:['Nickel-based jet engine superalloys','Petroleum reforming catalysts','High-temperature thermocouples'], shells:[2,8,18,32,13,2] },
  76:  { mp:3306,     bp:5285,     density:'22.59 g/cm³',  en:2.20,  ar:185,  ie:8.438,  ea:1.100,  ox:'+8,+4',          cas:'7440-04-2',  block:'d', yr:'1803',      origin:'Greek osme (smell; OsO₄ is pungent)',      uses:['Fountain pen tips & instrument pivots','Electrical contact hardening','Staining agent in microscopy'], shells:[2,8,18,32,14,2] },
  77:  { mp:2719,     bp:4701,     density:'22.56 g/cm³',  en:2.20,  ar:180,  ie:8.967,  ea:1.565,  ox:'+4,+3',          cas:'7439-88-5',  block:'d', yr:'1803',      origin:'Latin iris (rainbow; varied salt colors)', uses:['Hardening platinum alloys','Spark plug electrodes','Compasses & navigation instruments'], shells:[2,8,18,32,15,2] },
  78:  { mp:2041.4,   bp:4098,     density:'21.45 g/cm³',  en:2.28,  ar:177,  ie:8.958,  ea:2.128,  ox:'+4,+2',          cas:'7440-06-4',  block:'d', yr:'1735',      origin:'Spanish platina (little silver)',          uses:['Autocatalysts in vehicle exhaust systems','High-end jewelry & investment','Hydrogen fuel cell electrodes'], shells:[2,8,18,32,17,1] },
  79:  { mp:1337.33,  bp:3129,     density:'19.30 g/cm³',  en:2.54,  ar:174,  ie:9.226,  ea:2.309,  ox:'+3,+1',          cas:'7440-57-5',  block:'d', yr:'Prehistoric',origin:'Anglo-Saxon gold; Latin Aurum',            uses:['Jewelry & monetary reserves','Microelectronics connectors & bonding','Dentistry crowns & fillings'], shells:[2,8,18,32,18,1] },
  80:  { mp:234.43,   bp:629.88,   density:'13.534 g/cm³', en:2.00,  ar:171,  ie:10.437, ea:0,      ox:'+2,+1',          cas:'7439-97-6',  block:'d', yr:'Prehistoric',origin:'Latin Hydrargyrum (water silver)',          uses:['Compact fluorescent & sodium lamps','Dental amalgam restorations (historical)','Barometric & thermometric instruments'], shells:[2,8,18,32,18,2] },
  81:  { mp:577,      bp:1746,     density:'11.85 g/cm³',  en:1.62,  ar:156,  ie:6.108,  ea:0.200,  ox:'+3,+1',          cas:'7440-28-0',  block:'p', yr:'1861',      origin:'Greek thallos (green twig; green flame color)',uses:['High-density glass for electronics','Infrared detectors & imagers','Research uses only (toxic)'], shells:[2,8,18,32,18,3] },
  82:  { mp:600.61,   bp:2022,     density:'11.34 g/cm³',  en:2.33,  ar:154,  ie:7.417,  ea:0.364,  ox:'+4,+2',          cas:'7439-92-1',  block:'p', yr:'Prehistoric',origin:'Latin Plumbum',                            uses:['Lead-acid car batteries','Radiation shielding in X-ray rooms','Soldering & electronics (Pb-Sn alloys)'], shells:[2,8,18,32,18,4] },
  83:  { mp:544.55,   bp:1837,     density:'9.78 g/cm³',   en:2.02,  ar:143,  ie:7.289,  ea:0.946,  ox:'+5,+3',          cas:'7440-69-9',  block:'p', yr:'1753',      origin:'German Wismut (origin uncertain)',         uses:['Cosmetics (bismuth oxychloride pearlescent)','Pepto-Bismol stomach medicine','Low-melting-point alloys'], shells:[2,8,18,32,18,5] },
  84:  { mp:527,      bp:1235,     density:'9.32 g/cm³',   en:2.00,  ar:135,  ie:8.414,  ea:1.900,  ox:'+4,+2,−2',       cas:'7440-08-6',  block:'p', yr:'1898',      origin:'Latin Polonia (Poland, home of M. Curie)',uses:['Anti-static devices in industry','Nuclear batteries (Po-210 alpha source)','Oncology radiation therapy'], shells:[2,8,18,32,18,6] },
  85:  { mp:575,      bp:610,      density:'~7 g/cm³',     en:2.20,  ar:127,  ie:9.300,  ea:2.800,  ox:'+5,+3,+1,−1',   cas:'7440-68-8',  block:'p', yr:'1940',      origin:'Greek astatos (unstable)',                uses:['Targeted alpha-particle cancer therapy','Radiotracer diagnostic studies','Research only (all isotopes radioactive)'], shells:[2,8,18,32,18,7] },
  86:  { mp:202,      bp:211.5,    density:'9.73 g/L',     en:null,  ar:120,  ie:10.745, ea:0,      ox:'0',               cas:'10043-92-2', block:'p', yr:'1899',      origin:'Latin radius (ray); emanation of radium',  uses:['Lung cancer brachytherapy','Earthquake & volcanic activity prediction','Foundation radon testing'], shells:[2,8,18,32,18,8] },
  87:  { mp:300,      bp:950,      density:'~1.87 g/cm³',  en:0.70,  ar:348,  ie:4.073,  ea:0.470,  ox:'+1',              cas:'7440-73-5',  block:'s', yr:'1939',      origin:'France (homeland of discoverer M. Perey)',uses:['Atomic & nuclear research only','Half-life too short for practical use (~22 min)','Fundamental physics studies'], shells:[2,8,18,32,18,8,1] },
  88:  { mp:973,      bp:2010,     density:'5.50 g/cm³',   en:0.90,  ar:283,  ie:5.279,  ea:0.100,  ox:'+2',              cas:'7440-14-4',  block:'s', yr:'1898',      origin:'Latin radius (ray; highly radioactive)',   uses:['Historical: radium dial luminescent paint','Historical: cancer radiotherapy','Research in radioactive decay'], shells:[2,8,18,32,18,8,2] },
  89:  { mp:1323,     bp:3471,     density:'10.07 g/cm³',  en:1.10,  ar:260,  ie:5.170,  ea:0.350,  ox:'+3',              cas:'7440-34-8',  block:'f', yr:'1899',      origin:'Greek aktinos (ray; radioactive)',         uses:['Neutron source for scientific research','Actinium-225 targeted alpha therapy (cancer)','Education about radioactive series'], shells:[2,8,18,32,18,9,2] },
  90:  { mp:2115,     bp:5061,     density:'11.72 g/cm³',  en:1.30,  ar:237,  ie:6.308,  ea:0.608,  ox:'+4',              cas:'7440-29-1',  block:'f', yr:'1829',      origin:'Norse god Thor (thunder)',                uses:['Thorium-cycle nuclear reactor fuel','Gas mantle lanterns (ThO₂)','High-temperature alloys for aerospace'], shells:[2,8,18,32,18,10,2] },
  91:  { mp:1841,     bp:4300,     density:'15.37 g/cm³',  en:1.50,  ar:243,  ie:5.890,  ea:null,   ox:'+5,+4',          cas:'7440-13-3',  block:'f', yr:'1913',      origin:'Greek protos+actinium (before actinium)',uses:['Nuclear research & physics studies','Trace component in uranium ores','No significant commercial uses'], shells:[2,8,18,32,20,9,2] },
  92:  { mp:1405.3,   bp:4404,     density:'19.10 g/cm³',  en:1.38,  ar:240,  ie:6.194,  ea:null,   ox:'+6,+4',          cas:'7440-61-1',  block:'f', yr:'1789',      origin:'Planet Uranus (discovered 8 years earlier)',uses:['Nuclear power plant fuel (U-235)','Depleted uranium armor-piercing munitions','Radiometric dating of ancient rocks'], shells:[2,8,18,32,21,9,2] },
  93:  { mp:917,      bp:4273,     density:'20.25 g/cm³',  en:1.36,  ar:221,  ie:6.266,  ea:null,   ox:'+5,+4',          cas:'7439-99-8',  block:'f', yr:'1940',      origin:'Planet Neptune (next planet after Uranus)', uses:['Neutron detection instruments','Intermediate step in Pu-239 production','Nuclear physics research'], shells:[2,8,18,32,22,9,2] },
  94:  { mp:912.5,    bp:3501,     density:'19.84 g/cm³',  en:1.28,  ar:243,  ie:6.026,  ea:null,   ox:'+4,+3',          cas:'7440-07-5',  block:'f', yr:'1940',      origin:'Planet Pluto (next planet after Neptune)',uses:['Nuclear weapons (Pu-239 fissile)','Nuclear reactor MOX fuel','Radioisotope thermoelectric generators (RTGs)'], shells:[2,8,18,32,24,8,2] },
  95:  { mp:1449,     bp:2880,     density:'13.67 g/cm³',  en:1.13,  ar:230,  ie:5.974,  ea:null,   ox:'+3,+4',          cas:'7440-35-9',  block:'f', yr:'1944',      origin:'The Americas (discovered in the USA)',    uses:['Ionization-type smoke detectors (Am-241)','Neutron source (Am-Be)','Nuclear medicine calibration sources'], shells:[2,8,18,32,25,8,2] },
  96:  { mp:1618,     bp:3383,     density:'13.51 g/cm³',  en:1.28,  ar:222,  ie:5.991,  ea:null,   ox:'+3',              cas:'7440-51-9',  block:'f', yr:'1944',      origin:'Marie & Pierre Curie (both Nobel laureates)',uses:['Alpha-particle source in research instruments','Nuclear battery RTGs (Cm-244)','Medical research & treatment'], shells:[2,8,18,32,25,9,2] },
  97:  { mp:1259,     bp:2900,     density:'14.78 g/cm³',  en:1.30,  ar:null, ie:6.198,  ea:null,   ox:'+3,+4',          cas:'7440-40-6',  block:'f', yr:'1949',      origin:'Berkeley, California (synthesis location)',uses:['Californium production via neutron capture','Nuclear physics research only','Extremely rare — atoms exist briefly'], shells:[2,8,18,32,27,8,2] },
  98:  { mp:1173,     bp:1743,     density:'15.10 g/cm³',  en:1.30,  ar:null, ie:6.282,  ea:null,   ox:'+3',              cas:'98602-52-9', block:'f', yr:'1950',      origin:'California & University of California',   uses:['Neutron source for nuclear reactor startup','Cf-252 for cancer brachytherapy','Portable neutron activation analysis'], shells:[2,8,18,32,28,8,2] },
  99:  { mp:1133,     bp:null,     density:'~8.84 g/cm³',  en:1.30,  ar:null, ie:6.420,  ea:null,   ox:'+3',              cas:'7429-92-7',  block:'f', yr:'1952',      origin:'Albert Einstein (physicist)',             uses:['Research only (half-life 472 days for Es-253)','Production of heavier elements','Nuclear physics experiments'], shells:[2,8,18,32,29,8,2] },
  100: { mp:1800,     bp:null,     density:'~7.0 g/cm³',   en:1.30,  ar:null, ie:6.500,  ea:null,   ox:'+3',              cas:'7440-72-4',  block:'f', yr:'1952',      origin:'Enrico Fermi (nuclear physics pioneer)',   uses:['Research only (all isotopes short-lived)','Decay chain studies','Nuclear physics experiments'], shells:[2,8,18,32,30,8,2] },
  101: { mp:1100,     bp:null,     density:'~10.3 g/cm³',  en:1.30,  ar:null, ie:6.580,  ea:null,   ox:'+3,+2',          cas:'7440-11-1',  block:'f', yr:'1955',      origin:'Dmitri Mendeleev (creator of periodic table)',uses:['Research only — produced one atom at a time','Nuclear physics experiments','Studies of superheavy element chemistry'], shells:[2,8,18,32,31,8,2] },
  102: { mp:1100,     bp:null,     density:'~9.9 g/cm³',   en:1.30,  ar:null, ie:6.650,  ea:null,   ox:'+2,+3',          cas:'10028-14-5', block:'f', yr:'1957',      origin:'Alfred Nobel (inventor of dynamite)',      uses:['Research only (half-life ~58 min for No-259)','Probing divalent chemistry of heavy actinides','Fusion reaction studies'], shells:[2,8,18,32,32,8,2] },
  103: { mp:1900,     bp:null,     density:'~14.4 g/cm³',  en:1.30,  ar:null, ie:4.960,  ea:null,   ox:'+3',              cas:'22537-11-7', block:'d', yr:'1961',      origin:'Ernest O. Lawrence (cyclotron inventor)',  uses:['Research only — produced in trace quantities','Decay chain endpoint studies','Probe of d-block vs f-block boundary'], shells:[2,8,18,32,32,8,3] },
  104: { mp:null,     bp:null,     density:'~23 g/cm³',    en:null,  ar:null, ie:null,   ea:null,   ox:'+4',              cas:'53850-36-5', block:'d', yr:'1964',      origin:'Ernest Rutherford (nuclear physicist)',    uses:['Research only','Nuclear physics','Decay studies'], shells:[2,8,18,32,32,10,2] },
  105: { mp:null,     bp:null,     density:'~29 g/cm³',    en:null,  ar:null, ie:null,   ea:null,   ox:'+5',              cas:'53850-35-4', block:'d', yr:'1967',      origin:'Dubna, Russia (JINR research facility)',  uses:['Research only','Nuclear physics','Transactinide chemistry'], shells:[2,8,18,32,32,11,2] },
  106: { mp:null,     bp:null,     density:'~35 g/cm³',    en:null,  ar:null, ie:null,   ea:null,   ox:'+6',              cas:'54038-81-2', block:'d', yr:'1974',      origin:'Glenn T. Seaborg (transuranium discoverer)',uses:['Research only','Transactinide chemistry','Nuclear structure studies'], shells:[2,8,18,32,32,12,2] },
  107: { mp:null,     bp:null,     density:'~37 g/cm³',    en:null,  ar:null, ie:null,   ea:null,   ox:'+7',              cas:'54037-14-8', block:'d', yr:'1981',      origin:'Niels Bohr (quantum mechanics founder)',  uses:['Research only','Atom-by-atom chemistry','Nuclear physics'], shells:[2,8,18,32,32,13,2] },
  108: { mp:null,     bp:null,     density:'~41 g/cm³',    en:null,  ar:null, ie:null,   ea:null,   ox:'+8',              cas:'54037-57-9', block:'d', yr:'1984',      origin:'Hesse, Germany (GSI research facility)',  uses:['Research only','Atom-by-atom chemistry','Nuclear decay studies'], shells:[2,8,18,32,32,14,2] },
  109: { mp:null,     bp:null,     density:'~35 g/cm³',    en:null,  ar:null, ie:null,   ea:null,   ox:'+3,+1',          cas:'54038-01-6', block:'d', yr:'1982',      origin:'Lise Meitner (nuclear fission co-discoverer)',uses:['Research only','Nuclear physics','Fleeting atoms (ms lifetime)'], shells:[2,8,18,32,32,15,2] },
  110: { mp:null,     bp:null,     density:'~34.8 g/cm³',  en:null,  ar:null, ie:null,   ea:null,   ox:'+6,+4,+2',       cas:'54083-77-1', block:'d', yr:'1994',      origin:'Darmstadt, Germany (GSI facility)',       uses:['Research only','Superheavy element study','Nuclear structure'], shells:[2,8,18,32,32,16,2] },
  111: { mp:null,     bp:null,     density:'~28.7 g/cm³',  en:null,  ar:null, ie:null,   ea:null,   ox:'+3,+1',          cas:'54386-24-2', block:'d', yr:'1994',      origin:'Wilhelm Röntgen (discoverer of X-rays)',  uses:['Research only','Superheavy element chemistry','Nuclear decay studies'], shells:[2,8,18,32,32,17,2] },
  112: { mp:null,     bp:null,     density:'~23.7 g/cm³',  en:null,  ar:null, ie:null,   ea:null,   ox:'+2',              cas:'54084-26-3', block:'d', yr:'1996',      origin:'Nicolaus Copernicus (heliocentric astronomer)',uses:['Research only','Predicted to be volatile','Nuclear decay chains'], shells:[2,8,18,32,32,18,2] },
  113: { mp:null,     bp:null,     density:'~16 g/cm³',    en:null,  ar:null, ie:null,   ea:null,   ox:'+1',              cas:'54084-70-7', block:'p', yr:'2003',      origin:'Nihon (Japan) — first Asian-discovered element',uses:['Research only','Atom-by-atom detection','Nuclear physics'], shells:[2,8,18,32,32,18,3] },
  114: { mp:null,     bp:null,     density:'~14 g/cm³',    en:null,  ar:null, ie:null,   ea:null,   ox:'+2',              cas:'54085-16-4', block:'p', yr:'1998',      origin:'Flerov Laboratory, Dubna (Flerovium)',    uses:['Research only','Island of stability research','Decay chain studies'], shells:[2,8,18,32,32,18,4] },
  115: { mp:null,     bp:null,     density:'~13.5 g/cm³',  en:null,  ar:null, ie:null,   ea:null,   ox:'+1',              cas:'54085-64-2', block:'p', yr:'2003',      origin:'Moscow Oblast (Dubna, Russia)',            uses:['Research only','Island of stability investigation','Nuclear structure exploration'], shells:[2,8,18,32,32,18,5] },
  116: { mp:null,     bp:null,     density:'~12.9 g/cm³',  en:null,  ar:null, ie:null,   ea:null,   ox:'+2',              cas:'54100-71-9', block:'p', yr:'2000',      origin:'Lawrence Livermore Natl. Lab, California', uses:['Research only','Superheavy element research','Decay into Flerovium'], shells:[2,8,18,32,32,18,6] },
  117: { mp:null,     bp:null,     density:'~7.2 g/cm³',   en:null,  ar:null, ie:null,   ea:null,   ox:'+1,−1',          cas:'87658-56-8', block:'p', yr:'2010',      origin:'Tennessee (ORNL, Vanderbilt, U. of Tennessee)',uses:['Research only','Newest named element as of 2016','Nuclear decay studies'], shells:[2,8,18,32,32,18,7] },
  118: { mp:null,     bp:null,     density:'~4.9 g/cm³',   en:null,  ar:null, ie:null,   ea:null,   ox:'0',               cas:'54144-19-3', block:'p', yr:'2002',      origin:'Yuri Oganessian (superheavy element physicist)',uses:['Research only — just a few atoms created','Heaviest known element','Probe of relativistic quantum chemistry'], shells:[2,8,18,32,32,18,8] },
};

// ─── COMPREHENSIVE ELEMENT NOTES (118 Elements) ─────────────────────────────
const ELEM_NOTES = {
  1: "The most abundant chemical substance in the Universe, making up about 75% of all normal matter.",
  2: "The second most abundant element, discovered in the Sun's spectrum before being found on Earth.",
  3: "The least dense of all solid elements, it is so light it can float on water (and reacts with it!).",
  4: "Formed through cosmic ray spallation, it is key to the mirrors of the James Webb Space Telescope.",
  5: "An essential plant nutrient, amorphous boron is used as a green rocket propellant igniter.",
  6: "The basis of all known organic life, carbon is capable of forming nearly 10 million distinct compounds.",
  7: "Makes up 78.1% of Earth's atmosphere, and is the key building block of all amino acids.",
  8: "Highly reactive nonmetal that is the third most abundant element in the universe by mass.",
  9: "The most electronegative and reactive of all elements, it reacts with almost every other substance.",
  10: "Discovered in 1898, it glows with a reddish-orange light when utilized in high-voltage glow discharge.",
  11: "Sodium is an essential alkali metal that reacts violently with water and must be stored under mineral oil.",
  12: "The ninth most abundant element in the universe, it burns with an incredibly bright, white light.",
  13: "The most abundant metal in Earth's crust, once more valuable than gold due to extraction difficulty.",
  14: "The second most abundant element in Earth's crust, it is the foundational material of modern microchips.",
  15: "Highly reactive element that was first isolated from human urine by an alchemist seeking gold.",
  16: "Known in the Bible as brimstone, it is an essential nutrient for life and smells like rotten eggs when in compounds.",
  17: "A toxic, pale green gas used as a disinfectant, it combines with sodium to make common table salt.",
  18: "The third most abundant gas in Earth's atmosphere, it is widely used as a shielding gas in welding.",
  19: "An essential mineral that is highly reactive with water, potassium ions are crucial for nerve transmission.",
  20: "The fifth most abundant element in Earth's crust, it is essential for living organisms' bones and shells.",
  21: "A rare transition metal historically used in aluminum alloys for high-performance aerospace parts.",
  22: "As strong as steel but 45% lighter, titanium is highly resistant to corrosion in seawater and human tissue.",
  23: "A strong metal that is named after the Norse goddess of beauty due to its multicolored chemical compounds.",
  24: "A highly polished silvery metal, chromium is the key element that makes stainless steel rust-resistant.",
  25: "An essential trace mineral that is crucial for steel production and oxygen evolution in photosynthesis.",
  26: "The most common element on Earth by mass, forming much of Earth's outer and inner core.",
  27: "A magnetic metal whose name comes from a mythical German goblin because the ore was troublesome to mine.",
  28: "A corrosion-resistant metal widely used in coin alloys, stainless steel, and rechargeable batteries.",
  29: "One of the few metals that can occur in nature in a directly usable metallic form, mined for over 10,000 years.",
  30: "An essential mineral that is widely used to galvanize iron and steel to prevent rust and corrosion.",
  31: "A metal that melts in the palm of a hand (melting point 29.76°C) and can attack other metals like aluminum.",
  32: "A lustrous metalloid that was crucial in the invention of the first solid-state transistors.",
  33: "A notorious poison in history, arsenic is also used as a semiconductor dopant and in wood preservation.",
  34: "Named after the Moon, selenium is photoconductive (conducts electricity better in light) and used in solar cells.",
  35: "The only nonmetallic element that is a liquid at standard temperature and pressure, emitting a choking vapor.",
  36: "A noble gas used in energy-saving fluorescent lights and high-speed photography flash lamps.",
  37: "An extremely soft, reactive alkali metal that can ignite spontaneously in air and reacts explosively with water.",
  38: "Best known for producing intense red colors in fireworks, strontium isotopes are also used in bone research.",
  39: "Discovered in Ytterby, Sweden, yttrium is used to make red phosphors for displays and in superconducting ceramics.",
  40: "Highly resistant to corrosion, zirconium is used to coat nuclear fuel rods and forms cubic zirconia gemstones.",
  41: "A superconductor at low temperatures, niobium is named after Niobe, the daughter of King Tantalus.",
  42: "With a very high melting point, molybdenum is essential for high-strength steel alloys and enzymes.",
  43: "The first artificially produced element, technetium-99m is the most widely used medical radioisotope.",
  44: "A rare transition metal of the platinum group, it is used to harden platinum and palladium electrical contacts.",
  45: "One of the rarest and most valuable precious metals, rhodium is the primary catalyst for cleaning vehicle exhaust.",
  46: "A precious metal that can absorb up to 900 times its own volume of hydrogen gas, used in fuel cells.",
  47: "Has the highest electrical and thermal conductivity of any metal, prized for jewelry and electronics.",
  48: "A toxic heavy metal historically used in rechargeable Ni-Cd batteries and vibrant yellow pigments.",
  49: "An extremely soft metal, indium tin oxide (ITO) is the transparent conductor used in almost all touch screens.",
  50: "A soft metal used in bronze since antiquity, tin is widely used to coat food cans and in electronic solder.",
  51: "Sb is known since ancient times in cosmetics (kohl), antimony is used to harden lead-acid battery plates.",
  52: "One of the rarest elements in Earth's crust, tellurium is highly prized for thin-film solar cell technology.",
  53: "An essential nutrient for thyroid health, iodine sublimation produces a stunning deep purple vapor.",
  54: "A heavy noble gas used in high-intensity xenon headlights, anesthesia, and ion thrusters for deep space.",
  55: "The most reactive stable metal, cesium-133 is used to define the official length of a second in atomic clocks.",
  56: "A dense alkaline earth metal used as a green colorant in fireworks and as a contrast agent for medical imaging.",
  57: "The prototype of the lanthanide series, lanthanum is key to hybrid car batteries and high-end optical glass.",
  58: "The most abundant rare-earth element, cerium oxide is widely used as a polishing agent for glass and mirrors.",
  59: "Named the 'green twin', praseodymium is mixed with neodymium to create the strongest permanent magnets.",
  60: "Neodymium-iron-boron magnets are the strongest permanent magnets known, driving electric vehicles and wind turbines.",
  61: "The only radioactive lanthanide, promethium is used in nuclear batteries that power pacemakers and spacecraft.",
  62: "Samarium-cobalt magnets are extremely resistant to demagnetization at high temperatures.",
  63: "The most reactive rare-earth element, europium phosphors produce the vibrant red colors in TV and LED screens.",
  64: "Widely used as an intravenous contrast agent in MRI scans due to its unique magnetic properties.",
  65: "Terbium phosphors produce brilliant green colors, and Terfenol-D alloy changes shape in magnetic fields.",
  66: "Added to neodymium magnets to help them retain magnetism at the high operating temperatures of EV motors.",
  67: "Has the highest magnetic strength of any element, and is used to create strong artificial magnetic fields.",
  68: "Erbium-doped fibers act as optical amplifiers, boosting internet and data signals along undersea cables.",
  69: "The rarest stable lanthanide, thulium-170 is used in portable medical and industrial X-ray devices.",
  70: "Used in highly precise optical atomic clocks and to dope fiber laser systems.",
  71: "The heaviest and hardest lanthanide, lutetium crystals are the key detectors in PET medical scanners.",
  72: "An excellent neutron absorber used in nuclear reactor control rods and as a gate oxide in computer chips.",
  73: "An extremely corrosion-resistant metal used to make tiny, highly efficient capacitors in smartphones.",
  74: "Has the highest melting point of all elements (3422°C), used in heavy armor, penetrators, and light filaments.",
  75: "One of the rarest elements, rhenium is added to nickel-based superalloys for jet engine turbine blades.",
  76: "Osmium is the densest naturally occurring element. Its oxide is highly toxic but invaluable for biological staining.",
  77: "The most corrosion-resistant metal, iridium is famous for the 'K-T boundary' layer indicating asteroid impact.",
  78: "A highly unreactive precious metal used in vehicle catalytic converters, jewelry, and cancer chemotherapy drugs.",
  79: "Prized for its beauty and resistance to oxidation, gold is also a superb conductor in microelectronics.",
  80: "The only metal that is liquid at room temperature, mercury was historically called 'quicksilver'.",
  81: "An extremely toxic metal once popular as a rodenticide, it is used in specialized infrared optics.",
  82: "A heavy, soft metal used for thousands of years, lead is now restricted due to its cumulative neurotoxicity.",
  83: "Uniquely, bismuth is practically non-toxic despite its position among heavy metals, and forms rainbow crystals.",
  84: "Highly radioactive element discovered by Marie Curie, famously used as a heat source in Soviet lunar rovers.",
  85: "The rarest naturally occurring element in Earth's crust, with less than 30 grams existing at any one time.",
  86: "A radioactive noble gas that can accumulate in basements and is the second leading cause of lung cancer.",
  87: "The second rarest element in Earth's crust, it is highly radioactive and has no commercial uses.",
  88: "Discovered by Marie Curie, radium was historically used in glow-in-the-dark watch dials before safety bans.",
  89: "A highly radioactive element that glows with an eerie blue light in the dark, researched for cancer therapy.",
  90: "A radioactive metal that is three times more abundant than uranium, studied as a safer nuclear fuel alternative.",
  91: "A rare, radioactive actinide that is highly toxic and has no commercial uses outside of scientific research.",
  92: "The heaviest naturally occurring element, uranium-235 is the primary fuel for commercial nuclear reactors.",
  93: "The first transuranium element produced artificially, neptunium is created as a byproduct in nuclear reactors.",
  94: "A key fissile material used in nuclear weapons and space probes (RTGs), plutonium-239 is highly toxic.",
  95: "Used in household ionization smoke detectors, americium-241 emits alpha particles to sense smoke.",
  96: "Named after the Curies, curium-244 is a powerful alpha emitter used in space probes to analyze soil.",
  97: "Named after Berkeley, California, berkelium is extremely rare and primarily used to synthesize heavier elements.",
  98: "A powerful neutron emitter, californium-252 is used to start up nuclear reactors and treat deep cervical cancers.",
  99: "Discovered in the debris of the first thermonuclear bomb explosion in 1952, named after Albert Einstein.",
  100: "Discovered alongside einsteinium in thermonuclear debris, fermium is the heaviest element made by neutron bombardment.",
  101: "Named after Dmitri Mendeleev, mendelevium was the first element synthesized one atom at a time.",
  102: "Named after Alfred Nobel, nobelium is synthesized in particle accelerators by fusing light nuclei.",
  103: "Named after Ernest Lawrence, lawrencium lies on the boundary between the f-block and d-block actinides.",
  104: "The first transactinide (superheavy) element, rutherfordium-267 has a half-life of only 1.3 hours.",
  105: "Synthesized through cold fusion, dubnium is named after Dubna, Russia, where much of its research occurred.",
  106: "The first element named after a living person (Glenn Seaborg), it is highly unstable and radioactive.",
  107: "Bh is named after Niels Bohr. It has a half-life of just 61 seconds for its most stable isotope.",
  108: "Named after the German state of Hesse, hassium is predicted to form a highly volatile tetroxide like osmium.",
  109: "Named after Lise Meitner, meitnerium is a superheavy synthetic element with a fleeting existence.",
  110: "Named after Darmstadt, Germany, darmstadtium is produced by bombarding lead targets with nickel ions.",
  111: "Named after Wilhelm Röntgen, roentgenium is extremely unstable with a half-life of only 100 seconds.",
  112: "Named after Nicolaus Copernicus, copernicium is predicted to be a volatile metal that acts like a noble gas.",
  113: "The first element discovered and named by scientists in Japan (RIKEN), meaning 'Japan element'.",
  114: "Named after the Flerov Laboratory, flerovium is researched to see if it lies near the 'Island of Stability'.",
  115: "Named after the Moscow region, moscovium is synthesized by bombarding americium-243 with calcium-48.",
  116: "Named after Lawrence Livermore National Laboratory, livermorium was first synthesized in 2000.",
  117: "The second newest element on the periodic table, tennessine is named after the US state of Tennessee.",
  118: "The heaviest element on the periodic table, oganesson is named after Yuri Oganessian and is in Group 18."
};

// ─── UTILITIES ───────────────────────────────────────────────────────────────
const fullMassLookup = {};
elementsData.forEach(el => {
  if (el.mass && !el.isPlaceholder) fullMassLookup[el.symbol] = typeof el.mass === 'number' ? el.mass : parseFloat(el.mass);
});

function parseChemicalFormula(formula) {
  function parse(str) {
    const stack = [{}]; let i = 0;
    while (i < str.length) {
      const char = str[i];
      if (char === '(') { stack.push({}); i++; }
      else if (char === ')') {
        i++; let multStr = '';
        while (i < str.length && /\d/.test(str[i])) { multStr += str[i]; i++; }
        const mult = multStr ? parseInt(multStr) : 1;
        const group = stack.pop(); const cur = stack[stack.length - 1];
        for (const [sym, count] of Object.entries(group)) cur[sym] = (cur[sym] || 0) + count * mult;
      } else if (/[A-Z]/.test(char)) {
        let element = char; i++;
        if (i < str.length && /[a-z]/.test(str[i])) { element += str[i]; i++; }
        let countStr = '';
        while (i < str.length && /\d/.test(str[i])) { countStr += str[i]; i++; }
        const count = countStr ? parseInt(countStr) : 1;
        const cur = stack[stack.length - 1]; cur[element] = (cur[element] || 0) + count;
      } else { i++; }
    }
    return stack[0];
  }
  return parse(formula);
}

function getEnriched(el) {
  if (el.isPlaceholder) return el;
  const x = ELEM_EXTRA[el.number] || {};
  return { ...el, meltingPoint: x.mp, boilingPoint: x.bp, density: x.density, electronegativity: x.en,
    atomicRadius: x.ar, ionizationEnergy: x.ie, electronAffinity: x.ea, oxidationStates: x.ox,
    casNumber: x.cas, block: x.block, yearDiscovered: x.yr, nameOrigin: x.origin, uses: x.uses, shells: x.shells,
    note: ELEM_NOTES[el.number] || 'Fascinating element with unique chemical and physical characteristics.' };
}

// ─── HELPER COMPONENTS ───────────────────────────────────────────────────────
function SectionHeading({ color, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
      <div style={{ width: '3px', height: '16px', background: color, borderRadius: '2px', flexShrink: 0 }} />
      <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color }}>{title}</span>
    </div>
  );
}

function PropRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '5px 10px', background: 'rgba(255,255,255,0.025)', borderRadius: '6px', gap: '10px' }}>
      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '0.72rem', color: '#fff', fontWeight: 500, textAlign: 'right', lineHeight: 1.4 }}>{value}</span>
    </div>
  );
}

// ─── SHELL DIAGRAM SVG ───────────────────────────────────────────────────────
function ShellDiagram({ shells, color, atomicNumber }) {
  if (!shells || shells.length === 0) return null;
  const cx = 110, cy = 110;
  const radii = [18, 34, 52, 70, 88, 106, 124];
  const MAX_VISUAL = 14; // max electrons to draw per shell for clarity

  return (
    <svg width="220" height="220" viewBox="0 0 220 220" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id={`nucGrad${atomicNumber}`} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </radialGradient>
        <filter id={`glow${atomicNumber}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Shell orbits */}
      {shells.map((_, si) => (
        <circle key={`orbit-${si}`} cx={cx} cy={cy} r={radii[si] || 124 + si * 18}
          fill="none" stroke={color} strokeWidth="0.6" strokeDasharray="2 3" opacity="0.25" />
      ))}
      {/* Electrons */}
      {shells.map((count, si) => {
        const r = radii[si] || 124 + si * 18;
        const visual = Math.min(count, MAX_VISUAL);
        // Duration based on shell index, alternating direction
        const duration = 12 + si * 4; 
        const dir = si % 2 === 0 ? 360 : -360;
        
        return (
          <g key={`shell-group-${si}`}>
            <animateTransform 
              attributeName="transform" 
              type="rotate" 
              from={`0 ${cx} ${cy}`} 
              to={`${dir} ${cx} ${cy}`} 
              dur={`${duration}s`} 
              repeatCount="indefinite" 
            />
            {Array.from({ length: visual }, (_, ei) => {
              const angle = (2 * Math.PI * ei) / visual - Math.PI / 2;
              const ex = cx + r * Math.cos(angle);
              const ey = cy + r * Math.sin(angle);
              return (
                <circle key={`e-${si}-${ei}`} cx={ex} cy={ey} r={3.2}
                  fill={color} opacity={0.88} filter={`url(#glow${atomicNumber})`} />
              );
            })}
          </g>
        );
      })}
      {/* Nucleus */}
      <circle cx={cx} cy={cy} r={13} fill={`url(#nucGrad${atomicNumber})`} opacity={0.95} />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
        fill="#000" fontSize="7.5" fontWeight="800" fontFamily="monospace">{atomicNumber}</text>
    </svg>
  );
}

// ─── ELEMENT DETAIL MODAL ────────────────────────────────────────────────────
function ElementModal({ element, onClose, categories }) {
  const el = getEnriched(element);
  const catDetails = categories[el.category] || { color: '#8c92ac', shadow: 'rgba(140,146,172,0.4)', name: 'Unknown' };
  const color = catDetails.color;

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  const fmtK = (k) => k != null ? `${k} K  (${(k - 273.15).toFixed(1)} °C)` : 'Not established';
  const fmtNull = (v, unit = '') => v != null ? `${v}${unit ? ' ' + unit : ''}` : 'N/A';

  // Period display label (rows 9/10 are the lanthanide/actinide sub-rows)
  const periodLabel = el.period === 9 ? '6 (Lanthanide row)' : el.period === 10 ? '7 (Actinide row)' : el.period;

  const stats = [
    { label: 'Atomic Mass', value: `${el.mass} u` },
    { label: 'Period', value: periodLabel },
    { label: 'Group', value: el.group },
    { label: 'Block', value: el.block || '?' },
    { label: 'Phase at STP', value: el.state },
  ];

  // Format shells into K2 L8 M18 etc
  const getShellLabel = (shells) => {
    const shellLetters = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
    if (!shells) return shellLetters.map(l => `${l}0`).join(' ');
    return shellLetters.map((letter, idx) => {
      const count = shells[idx] || 0;
      return `${letter}${count}`;
    }).join(' ');
  };

  const massNum = typeof el.mass === 'number' ? el.mass : parseFloat(el.mass) || 0;
  const neutrons = Math.round(massNum) - el.number;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 3000,
        background: 'rgba(2, 4, 12, 0.45)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center', // Vertically center the modal perfectly
        justifyContent: 'center', // Horizontally center the modal perfectly
        padding: '24px 16px',
        animation: 'fadeIn 0.18s ease-out'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '720px',
          height: 'min(780px, 85dvh)', // Premium fixed height that dynamically scales with the viewport height
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(155deg, rgba(16, 20, 38, 0.65) 0%, rgba(8, 10, 22, 0.75) 100%)',
          backdropFilter: 'blur(30px)',
          border: `1px solid ${color}35`,
          borderRadius: '20px',
          boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 50px ${color}15`,
          animation: 'scaleUp 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          overflow: 'hidden'
        }}
      >
        {/* ── HEADER BANNER ─────────────────────────────────────────── */}
        <div style={{ background: `linear-gradient(145deg, ${color}18 0%, ${color}06 50%, transparent 100%)`,
          borderBottom: `1px solid ${color}20`, padding: '24px 28px 20px', borderRadius: '20px 20px 0 0', position: 'relative', flexShrink: 0 }}>
          {/* Close */}
          <button onClick={onClose}
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', width: '34px', height: '34px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
            {/* Big symbol */}
            <div>
              <div style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1, color,
                textShadow: `0 0 30px ${color}90, 0 0 60px ${color}50, 0 0 100px ${color}25` }}>
                {el.symbol}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '0.05em', marginTop: '-2px' }}>
                {el.config}
              </div>
            </div>
            {/* Name + category */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '6px',
                background: `${color}18`, border: `1px solid ${color}35`, padding: '3px 10px',
                borderRadius: '20px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {catDetails.name}
                </span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', margin: '0 0 2px 0', lineHeight: 1.1 }}>{el.name}</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>Atomic Number {el.number}</p>
            </div>
          </div>

          {/* Key stat chips */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
            {stats.map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '10px', padding: '6px 12px', minWidth: '80px' }}>
                <div style={{ fontSize: '0.54rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginTop: '2px', textTransform: 'capitalize' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SCROLLABLE BODY ───────────────────────────────────────── */}
        <div className="modal-scroll" style={{ flex: '1 1 auto', minHeight: 0, padding: '22px 28px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Fact Note Callout */}
          <div style={{
            background: `${color}0c`,
            borderLeft: `4px solid ${color}`,
            padding: '12px 16px',
            borderRadius: '0 12px 12px 0',
            boxShadow: `inset 0 0 12px ${color}05`
          }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
              Key Fact &amp; Educational Insight
            </div>
            <p style={{ fontSize: '0.78rem', color: '#e2e8f0', margin: 0, lineHeight: 1.45, fontStyle: 'italic' }}>
              "{el.note}"
            </p>
          </div>

          {/* Row: Shell diagram + Physical Properties */}
          <div className="modal-grid">
            {/* Shell diagram Column */}
            <div style={{ background: 'rgba(4,6,16,0.7)', border: `1px solid ${color}20`, borderRadius: '14px',
              padding: '14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '190px' }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Electron Shells</span>
              {el.shells && el.shells.length > 0
                ? <ShellDiagram shells={el.shells} color={color} atomicNumber={el.number} />
                : <div style={{ width: '180px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)', fontSize: '0.7rem', textAlign: 'center', padding: '10px' }}>
                    Shell data unavailable for synthetic element
                  </div>
              }
              {el.shells && (
                <div style={{
                  marginTop: '8px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '8px',
                  padding: '5px 10px',
                  fontSize: '0.7rem',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  color: '#fff',
                  textAlign: 'center',
                  boxShadow: `0 0 8px ${color}10`,
                  letterSpacing: '0.03em',
                  width: '100%'
                }}>
                  {getShellLabel(el.shells)}
                </div>
              )}

              {/* Subatomic Particle Counts */}
              <div style={{ marginTop: '14px', width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '0.58rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                  Subatomic Particles
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '6px 2px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.46rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Protons</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8' }}>{el.number}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '6px 2px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.46rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Electrons</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fbbf24' }}>{el.number}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '6px 2px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.46rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Neutrons</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f43f5e' }}>{neutrons >= 0 ? neutrons : '?'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Physical Properties Column - height aligned with shells */}
            <div style={{ background: 'rgba(4,6,16,0.7)', border: `1px solid ${color}20`, borderRadius: '14px',
              padding: '14px 12px', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <SectionHeading color={color} title="Physical Properties" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, justifyContent: 'center' }}>
                <PropRow label="Melting Point" value={fmtK(el.meltingPoint)} />
                <PropRow label="Boiling Point" value={fmtK(el.boilingPoint)} />
                <PropRow label="Density" value={el.density || 'Unknown'} />
                <PropRow label="Standard State" value={el.state || 'Unknown'} />
              </div>
            </div>
          </div>

          {/* Atomic Properties */}
          <div>
            <SectionHeading color={color} title="Atomic Properties" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
              <PropRow label="Electronegativity" value={fmtNull(el.electronegativity, '(Pauling)')} />
              <PropRow label="Atomic Radius" value={fmtNull(el.atomicRadius, 'pm')} />
              <PropRow label="1st Ionization Energy" value={fmtNull(el.ionizationEnergy, 'eV')} />
              <PropRow label="Electron Affinity" value={fmtNull(el.electronAffinity, 'eV')} />
              <PropRow label="Oxidation States" value={el.oxidationStates || 'N/A'} />
              <PropRow label="CAS Number" value={el.casNumber || 'N/A'} />
            </div>
          </div>

          {/* Discovery & History */}
          <div>
            <SectionHeading color={color} title="Discovery & History" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <PropRow label="Discovered By" value={el.discoverer || 'Unknown'} />
              <PropRow label="Year" value={el.yearDiscovered || 'Unknown'} />
              <PropRow label="Name Origin" value={el.nameOrigin || 'Unknown'} />
            </div>
          </div>

          {/* Uses */}
          {el.uses && el.uses.length > 0 && (
            <div>
              <SectionHeading color={color} title="Applications & Uses" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {el.uses.map((use, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px',
                    background: 'rgba(255,255,255,0.025)', borderRadius: '8px', padding: '8px 12px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: color,
                      flexShrink: 0, marginTop: '4px', boxShadow: `0 0 6px ${color}` }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{use}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer note */}
          <div style={{ textAlign: 'center', fontSize: '0.62rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px', flexShrink: 0 }}>
            Press <kbd style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '1px 6px', fontFamily: 'monospace' }}>Esc</kbd> or click outside to close · Data: CODATA / IUPAC / WebElements
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CATEGORY STYLES ─────────────────────────────────────────────────────────
const elementCategories = {
  'nonmetal':        { name: 'Reactive Nonmetals',   color: '#ff3366', shadow: 'rgba(255,51,102,0.4)' },
  'noble-gas':       { name: 'Noble Gases',           color: '#bd00ff', shadow: 'rgba(189,0,255,0.4)' },
  'alkali':          { name: 'Alkali Metals',         color: '#ff6b00', shadow: 'rgba(255,107,0,0.4)' },
  'alkaline-earth':  { name: 'Alkaline Earth Metals', color: '#ffd700', shadow: 'rgba(255,215,0,0.4)' },
  'metalloid':       { name: 'Metalloids',            color: '#00ff66', shadow: 'rgba(0,255,102,0.4)' },
  'halogen':         { name: 'Halogens',              color: '#00f0ff', shadow: 'rgba(0,240,255,0.4)' },
  'post-transition': { name: 'Post-transition Metals',color: '#33fffc', shadow: 'rgba(51,255,252,0.4)' },
  'transition-metal':{ name: 'Transition Metals',     color: '#0088ff', shadow: 'rgba(0,136,255,0.4)' },
  'lanthanide':      { name: 'Lanthanides',           color: '#ff00ff', shadow: 'rgba(255,0,255,0.4)' },
  'actinide':        { name: 'Actinides',             color: '#ff00aa', shadow: 'rgba(255,0,170,0.4)' },
  'unknown':         { name: 'Unknown Properties',    color: '#8c92ac', shadow: 'rgba(140,146,172,0.4)' },
};

// ─── ANIMATION CSS ────────────────────────────────────────────────────────────
const animStyles = `
@keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
@keyframes scaleUp { from { transform: scale(0.93); opacity: 0 } to { transform: scale(1); opacity: 1 } }

/* Neon Scrollbar styling */
.chemistry-scroll::-webkit-scrollbar, .modal-scroll::-webkit-scrollbar {
  width: 9px;
  height: 9px;
}
.chemistry-scroll::-webkit-scrollbar-track, .modal-scroll::-webkit-scrollbar-track {
  background: rgba(10, 12, 22, 0.4);
  border-radius: 8px;
}
.chemistry-scroll::-webkit-scrollbar-thumb, .modal-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #ff3366, #bd00ff);
  border-radius: 8px;
  border: 2px solid rgba(10, 12, 22, 0.4);
  box-shadow: 0 0 10px rgba(255, 51, 102, 0.4);
}
.chemistry-scroll::-webkit-scrollbar-thumb:hover, .modal-scroll::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #ff5588, #d033ff);
}

/* Modal layout grid */
.modal-grid {
  display: grid;
  grid-template-columns: 210px 1fr;
  gap: 20px;
  align-items: stretch;
}
@media (max-width: 640px) {
  .modal-grid {
    grid-template-columns: 1fr !important;
  }
}
`;

// ─── CHEMICAL EQUATION BALANCER MATHEMATICAL ALGORITHM ────────────────────────
function balanceEquation(equationStr) {
  const sides = equationStr.split(/->|=/);
  if (sides.length !== 2) throw new Error("Equation must contain '->' or '=' to separate reactants and products.");
  
  const reactantParts = sides[0].split('+').map(s => s.trim()).filter(Boolean);
  const productParts = sides[1].split('+').map(s => s.trim()).filter(Boolean);
  
  if (reactantParts.length === 0 || productParts.length === 0) {
    throw new Error("Must have at least one reactant and one product.");
  }
  
  const reactants = reactantParts.map(comp => parseChemicalFormula(comp));
  const products = productParts.map(comp => parseChemicalFormula(comp));
  
  const allElements = new Set();
  reactants.forEach(r => Object.keys(r).forEach(el => allElements.add(el)));
  products.forEach(p => Object.keys(p).forEach(el => allElements.add(el)));
  
  const elements = Array.from(allElements);
  if (elements.length === 0) throw new Error("No valid chemical elements found.");
  
  const numReactants = reactants.length;
  const numProducts = products.length;
  const numCompounds = numReactants + numProducts;
  
  const matrix = elements.map(el => {
    const row = new Array(numCompounds).fill(0);
    for (let c = 0; c < numReactants; c++) {
      row[c] = reactants[c][el] || 0;
    }
    for (let c = 0; c < numProducts; c++) {
      row[numReactants + c] = -(products[c][el] || 0);
    }
    return row;
  });
  
  const rows = matrix.length;
  const cols = numCompounds;
  
  let mat = matrix.map(r => [...r]);
  
  let lead = 0;
  for (let r = 0; r < rows; r++) {
    if (lead >= cols) break;
    let i = r;
    while (mat[i][lead] === 0) {
      i++;
      if (i === rows) {
        i = r;
        lead++;
        if (lead === cols) break;
      }
    }
    if (lead === cols) break;
    
    let temp = mat[i];
    mat[i] = mat[r];
    mat[r] = temp;
    
    let val = mat[r][lead];
    if (Math.abs(val) > 1e-9) {
      for (let c = 0; c < cols; c++) {
        mat[r][c] /= val;
      }
    }
    
    for (let i = 0; i < rows; i++) {
      if (i !== r) {
        let val2 = mat[i][lead];
        for (let c = 0; c < cols; c++) {
          mat[i][c] -= val2 * mat[r][c];
        }
      }
    }
    lead++;
  }
  
  const pivotCols = [];
  const freeCols = [];
  let r = 0;
  for (let c = 0; c < cols; c++) {
    if (r < mat.length && Math.abs(mat[r][c] - 1) < 1e-9) {
      pivotCols.push(c);
      r++;
    } else {
      freeCols.push(c);
    }
  }
  
  if (freeCols.length === 0) {
    throw new Error("No non-trivial solution exists. This equation cannot be balanced.");
  }
  
  const coeffs = new Array(cols).fill(0);
  freeCols.forEach(c => { coeffs[c] = 1.0; });
  
  for (let i = 0; i < pivotCols.length; i++) {
    const pivot = pivotCols[i];
    let val = 0;
    freeCols.forEach(fc => {
      val -= mat[i][fc] * coeffs[fc];
    });
    coeffs[pivot] = val;
  }
  
  let bestM = 1;
  for (let m = 1; m <= 1000; m++) {
    let error = 0;
    let allPositive = true;
    for (let c = 0; c < cols; c++) {
      const val = coeffs[c] * m;
      const rounded = Math.round(val);
      error += Math.abs(val - rounded);
      if (rounded <= 0 || val < 1e-4) allPositive = false;
    }
    if (allPositive && error < 1e-3) {
      bestM = m;
      break;
    }
  }
  
  const finalCoeffs = coeffs.map(c => Math.round(c * bestM));
  
  const leftCounts = {};
  const rightCounts = {};
  elements.forEach(el => {
    leftCounts[el] = 0;
    rightCounts[el] = 0;
  });
  
  for (let c = 0; c < numReactants; c++) {
    const coeff = finalCoeffs[c];
    if (coeff <= 0 || isNaN(coeff)) throw new Error("Could not find positive coefficients. Double check equation symbols.");
    Object.entries(reactants[c]).forEach(([el, count]) => {
      leftCounts[el] += count * coeff;
    });
  }
  for (let c = 0; c < numProducts; c++) {
    const coeff = finalCoeffs[numReactants + c];
    if (coeff <= 0 || isNaN(coeff)) throw new Error("Could not find positive coefficients. Double check equation symbols.");
    Object.entries(products[c]).forEach(([el, count]) => {
      rightCounts[el] += count * coeff;
    });
  }
  
  for (const el of elements) {
    if (leftCounts[el] !== rightCounts[el]) {
      throw new Error(`Mathematical balancing failed for element: ${el}`);
    }
  }
  
  return {
    reactants: reactantParts,
    products: productParts,
    reactantCoeffs: finalCoeffs.slice(0, numReactants),
    productCoeffs: finalCoeffs.slice(numReactants),
    elements,
    leftCounts,
    rightCounts
  };
}

// ─── CHEMICAL BALANCER COMPONENT ──────────────────────────────────────────────
function ChemicalBalancer({ accentColor }) {
  const [equation, setEquation] = useState('C6H12O6 + O2 -> CO2 + H2O');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const presets = [
    { name: 'Photosynthesis', eq: 'CO2 + H2O -> C6H12O6 + O2' },
    { name: 'Combustion of Propane', eq: 'C3H8 + O2 -> CO2 + H2O' },
    { name: 'Rusting of Iron', eq: 'Fe + O2 -> Fe2O3' },
    { name: 'Redox Reaction', eq: 'KMnO4 + HCl -> KCl + MnCl2 + Cl2 + H2O' },
    { name: 'Thermite Process', eq: 'Fe2O3 + Al -> Al2O3 + Fe' }
  ];

  const handleBalance = (eqStr) => {
    if (!eqStr.trim()) { setResult(null); setError(''); return; }
    try {
      const balanced = balanceEquation(eqStr);
      setResult(balanced);
      setError('');
    } catch (e) {
      setResult(null);
      setError(e.message || 'Error balancing equation.');
    }
  };

  useEffect(() => {
    handleBalance(equation);
  }, [equation]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px 0' }}>
          <RefreshCw size={16} style={{ color: '#10b981' }} />
          Chemical Equation Balancer
        </h3>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Input reactants and products separated by "-&gt;" or "=" — e.g. Fe + O2 -&gt; Fe2O3</p>
      </div>

      <input
        type="text"
        value={equation}
        onChange={(e) => setEquation(e.target.value)}
        className="glass-input"
        placeholder="Reactants -> Products"
        style={{ fontSize: '0.88rem', fontFamily: 'monospace', letterSpacing: '0.05em', width: '100%' }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {presets.map(p => (
          <button
            key={p.name}
            onClick={() => setEquation(p.eq)}
            className="btn-glow"
            style={{
              padding: '4px 8px',
              fontSize: '0.62rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '6px',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ padding: '8px 12px', background: 'rgba(255, 51, 102, 0.08)', border: '1px solid rgba(255, 51, 102, 0.2)', borderRadius: '8px', fontSize: '0.72rem', color: '#ff3366', fontWeight: 500 }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 8px', background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.02)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', width: '100%', marginBottom: '2px' }}>Balanced Equation</span>
            {result.reactants.map((react, idx) => {
              const coeff = result.reactantCoeffs[idx];
              return (
                <React.Fragment key={`r-${idx}`}>
                  {idx > 0 && <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>+</span>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {coeff > 1 && (
                      <span style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}40`, color: accentColor, borderRadius: '4px', padding: '1px 6px', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'monospace' }}>
                        {coeff}
                      </span>
                    )}
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{react}</span>
                  </div>
                </React.Fragment>
              );
            })}
            <span style={{ color: accentColor, fontWeight: 700, fontSize: '0.9rem', margin: '0 4px' }}>→</span>
            {result.products.map((prod, idx) => {
              const coeff = result.productCoeffs[idx];
              return (
                <React.Fragment key={`p-${idx}`}>
                  {idx > 0 && <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>+</span>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {coeff > 1 && (
                      <span style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}40`, color: accentColor, borderRadius: '4px', padding: '1px 6px', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'monospace' }}>
                        {coeff}
                      </span>
                    )}
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{prod}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Element Audit &amp; Conservation Check</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '6px' }}>
              {result.elements.map(el => {
                const count = result.leftCounts[el];
                return (
                  <div key={el} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', fontSize: '0.72rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 800, color: accentColor, fontSize: '0.8rem' }}>{el}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{count} atoms</span>
                    </div>
                    <span style={{ color: '#00ff66', fontWeight: 700 }}>✓</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── RADIOACTIVE DECAY TIMELINE COMPONENT ─────────────────────────────────────
function RadioactiveDecayTimeline({ accentColor }) {
  const [presetIdx, setPresetIdx] = useState(0);
  const [initialMass, setInitialMass] = useState(100);
  const [elapsed, setElapsed] = useState(5730);
  
  const [customHalfLife, setCustomHalfLife] = useState('100');
  const [customUnit, setCustomUnit] = useState('years');
  const [isCustom, setIsCustom] = useState(false);

  const decayPresets = [
    { name: 'Carbon-14 (C-14)', halfLife: 5730, unit: 'years', desc: 'Radiocarbon dating for organic materials' },
    { name: 'Uranium-238 (U-238)', halfLife: 4.468e9, unit: 'years', desc: 'Geochronology, dating oldest rocks' },
    { name: 'Cesium-137 (Cs-137)', halfLife: 30.17, unit: 'years', desc: 'Fission product in nuclear waste' },
    { name: 'Iodine-131 (I-131)', halfLife: 8.02, unit: 'days', desc: 'Medical tracer for thyroid diagnostic studies' },
    { name: 'Radon-222 (Rn-222)', halfLife: 3.824, unit: 'days', desc: 'Natural basement gas hazard' },
    { name: 'Tritium (H-3)', halfLife: 12.32, unit: 'years', desc: 'Self-powered glowing emergency lights' }
  ];

  const activePreset = decayPresets[presetIdx];
  const halfLifeVal = isCustom ? (parseFloat(customHalfLife) || 1) : activePreset.halfLife;
  const timeUnit = isCustom ? customUnit : activePreset.unit;

  const maxElapsed = halfLifeVal * 5;

  const nHalfLives = elapsed / halfLifeVal;
  const remainingPercent = Math.pow(0.5, nHalfLives) * 100;
  const remainingMass = initialMass * (remainingPercent / 100);
  const decayedMass = initialMass - remainingMass;

  useEffect(() => {
    if (!isCustom) {
      setElapsed(decayPresets[presetIdx].halfLife);
    }
  }, [presetIdx, isCustom]);

  const points = [];
  const chartWidth = 280;
  const chartHeight = 110;
  for (let x = 0; x <= 100; x += 4) {
    const hl = (x / 100) * 5;
    const pct = Math.pow(0.5, hl) * 100;
    const svgX = 20 + (x / 100) * (chartWidth - 40);
    const svgY = (chartHeight - 15) - (pct / 100) * (chartHeight - 25);
    points.push(`${svgX},${svgY}`);
  }
  const pathD = `M ${points.join(' L ')}`;

  const currentHL = Math.min(nHalfLives, 5);
  const dotX = 20 + (currentHL / 5) * (chartWidth - 40);
  const dotPercent = Math.pow(0.5, currentHL) * 100;
  const dotY = (chartHeight - 15) - (dotPercent / 100) * (chartHeight - 25);

  const formatSci = (num) => {
    if (num >= 1e6 || num < 1e-3) return num.toExponential(3);
    return num.toLocaleString(undefined, { maximumFractionDigits: 3 });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-mobile-1fr">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px 0' }}>
            <Activity size={16} style={{ color: '#fbbf24' }} />
            Radioactive Decay Simulator
          </h3>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Model exponential mass reduction over isotopic half-life timelines.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Select Isotope</label>
          <select
            value={isCustom ? 'custom' : presetIdx}
            onChange={(e) => {
              if (e.target.value === 'custom') {
                setIsCustom(true);
              } else {
                setIsCustom(false);
                setPresetIdx(parseInt(e.target.value));
              }
            }}
            className="glass-input"
            style={{ width: '100%', cursor: 'pointer', fontSize: '0.78rem' }}
          >
            {decayPresets.map((p, idx) => (
              <option key={p.name} value={idx} style={{ background: '#0a0c16' }}>{p.name}</option>
            ))}
            <option value="custom" style={{ background: '#0a0c16' }}>-- Custom Isotope --</option>
          </select>
        </div>

        {isCustom && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Half-Life Value</label>
              <input type="number" value={customHalfLife} onChange={(e) => setCustomHalfLife(e.target.value)} className="glass-input" style={{ fontSize: '0.75rem', padding: '5px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Time Unit</label>
              <select value={customUnit} onChange={(e) => setCustomUnit(e.target.value)} className="glass-input" style={{ fontSize: '0.75rem', padding: '5px', cursor: 'pointer' }}>
                {['seconds', 'minutes', 'hours', 'days', 'years'].map(u => (
                  <option key={u} value={u} style={{ background: '#0a0c16' }}>{u}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {!isCustom && (
          <div style={{ fontSize: '0.68rem', color: accentColor, background: `${accentColor}06`, padding: '6px 10px', borderLeft: `2px solid ${accentColor}`, borderRadius: '0 6px 6px 0', fontStyle: 'italic' }}>
            {activePreset.desc} (Half-life: {formatSci(activePreset.halfLife)} {activePreset.unit})
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Initial Mass (N₀)</span>
            <span style={{ fontWeight: 600, color: '#fff' }}>{initialMass} g</span>
          </div>
          <input type="range" min="1" max="1000" value={initialMass} onChange={(e) => setInitialMass(parseFloat(e.target.value))} style={{ accentColor }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Elapsed Time (t)</span>
            <span style={{ fontWeight: 600, color: '#fff' }}>{formatSci(elapsed)} {timeUnit}</span>
          </div>
          <input
            type="range"
            min="0"
            max={maxElapsed}
            step={maxElapsed / 100}
            value={elapsed}
            onChange={(e) => setElapsed(parseFloat(e.target.value) || 0)}
            style={{ accentColor }}
          />
          <input
            type="number"
            value={elapsed}
            onChange={(e) => setElapsed(Math.max(0, parseFloat(e.target.value) || 0))}
            className="glass-input"
            style={{ fontSize: '0.72rem', padding: '4px 8px', marginTop: '-2px' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ background: 'rgba(5,7,12,0.6)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '14px', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', alignSelf: 'flex-start', margin: '0 0 6px 4px' }}>Decay Curve (N/N₀ vs. Half-Lives)</span>
          <svg width={chartWidth} height={chartHeight} style={{ overflow: 'visible' }}>
            <line x1="20" y1="15" x2="20" y2={chartHeight - 15} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="20" y1={chartHeight - 15} x2={chartWidth - 20} y2={chartHeight - 15} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
            
            {[0, 1, 2, 3, 4, 5].map(hl => {
              const xPos = 20 + (hl / 5) * (chartWidth - 40);
              return (
                <g key={hl}>
                  <line x1={xPos} y1={chartHeight - 15} x2={xPos} y2={chartHeight - 10} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <text x={xPos} y={chartHeight - 1} textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="monospace">{hl}t½</text>
                </g>
              );
            })}

            {[0, 25, 50, 75, 100].map(p => {
              const yPos = (chartHeight - 15) - (p / 100) * (chartHeight - 25);
              return (
                <g key={p}>
                  <line x1="15" y1={yPos} x2="20" y2={yPos} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  <text x="12" y={yPos + 3} textAnchor="end" fill="var(--text-muted)" fontSize="9" fontFamily="monospace">{p}%</text>
                </g>
              );
            })}

            <path d={pathD} fill="none" stroke={accentColor} strokeWidth="2.5" opacity="0.88" />
            <circle cx={dotX} cy={dotY} r="5" fill="#fff" stroke={accentColor} strokeWidth="2" style={{ filter: 'drop-shadow(0 0 6px ' + accentColor + ')' }} />
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '10px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Remaining Mass:</span>
            <span className="math-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: accentColor }}>
              {formatSci(remainingMass)} g <span style={{ fontSize: '0.68rem', color: '#fff', fontWeight: 500 }}>({remainingPercent.toFixed(2)}%)</span>
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Decayed Solute:</span>
            <span className="math-mono" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {formatSci(decayedMass)} g <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>({(100 - remainingPercent).toFixed(2)}%)</span>
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Half-Lives Elapsed:</span>
            <span className="math-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
              {nHalfLives.toFixed(4)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DILUTION & MOLARITY SOLVER COMPONENT ─────────────────────────────────────
function DilutionSolver({ accentColor }) {
  const [mode, setMode] = useState('molarity');
  
  const [molTarget, setMolTarget] = useState('M');
  const [molarity, setMolarity] = useState('0.1');
  const [moles, setMoles] = useState('0.05');
  const [volume, setVolume] = useState('0.5');
  const [molWeight, setMolWeight] = useState('98.08');
  const [mass, setMass] = useState('4.904');

  const [dilTarget, setDilTarget] = useState('M2');
  const [m1, setM1] = useState('1.0');
  const [v1, setV1] = useState('0.1');
  const [m2, setM2] = useState('0.1');
  const [v2, setV2] = useState('1.0');

  const solveMolarity = () => {
    try {
      const M = parseFloat(molarity) || 0;
      const n = parseFloat(moles) || 0;
      const V = parseFloat(volume) || 0;
      const mw = parseFloat(molWeight) || 0;
      const m = parseFloat(mass) || 0;

      if (molTarget === 'M') {
        if (V <= 0) return { err: 'Volume must be > 0' };
        const ans = n / V;
        const massAns = ans * V * mw;
        return { val: ans.toFixed(4) + ' M', details: `n / V = ${n} / ${V} = ${ans.toFixed(4)} mol/L`, massVal: massAns.toFixed(3) + ' g' };
      } else if (molTarget === 'n') {
        const ans = M * V;
        const massAns = ans * mw;
        return { val: ans.toFixed(4) + ' mol', details: `M × V = ${M} × ${V} = ${ans.toFixed(4)} mol`, massVal: massAns.toFixed(3) + ' g' };
      } else if (molTarget === 'V') {
        if (M <= 0) return { err: 'Molarity must be > 0' };
        const ans = n / M;
        return { val: ans.toFixed(4) + ' L  (' + (ans * 1000).toFixed(1) + ' mL)', details: `n / M = ${n} / ${M} = ${ans.toFixed(4)} L` };
      } else if (molTarget === 'g') {
        const ans = M * V * mw;
        return { val: ans.toFixed(3) + ' g', details: `M × V × MW = ${M} × ${V} × ${mw} = ${ans.toFixed(3)} g` };
      }
    } catch (e) {
      return { err: 'Calculation error' };
    }
  };

  const solveDilution = () => {
    try {
      const M1 = parseFloat(m1) || 0;
      const V1 = parseFloat(v1) || 0;
      const M2 = parseFloat(m2) || 0;
      const V2 = parseFloat(v2) || 0;

      if (dilTarget === 'M1') {
        if (V1 <= 0) return { err: 'V1 must be > 0' };
        const ans = (M2 * V2) / V1;
        return { val: ans.toFixed(4) + ' M', details: `(M2 × V2) / V1 = (${M2} × ${V2}) / ${V1} = ${ans.toFixed(4)} M`, m1: ans, v1: V1, m2: M2, v2: V2 };
      } else if (dilTarget === 'V1') {
        if (M1 <= 0) return { err: 'M1 must be > 0' };
        const ans = (M2 * V2) / M1;
        return { val: ans.toFixed(4) + ' L  (' + (ans * 1000).toFixed(1) + ' mL)', details: `(M2 × V2) / M1 = (${M2} × ${V2}) / ${M1} = ${ans.toFixed(4)} L`, m1: M1, v1: ans, m2: M2, v2: V2 };
      } else if (dilTarget === 'M2') {
        if (V2 <= 0) return { err: 'V2 must be > 0' };
        const ans = (M1 * V1) / V2;
        return { val: ans.toFixed(4) + ' M', details: `(M1 × V1) / V2 = (${M1} × ${V1}) / ${V2} = ${ans.toFixed(4)} M`, m1: M1, v1: V1, m2: ans, v2: V2 };
      } else if (dilTarget === 'V2') {
        if (M2 <= 0) return { err: 'M2 must be > 0' };
        const ans = (M1 * V1) / M2;
        return { val: ans.toFixed(4) + ' L  (' + (ans * 1000).toFixed(1) + ' mL)', details: `(M1 × V1) / M2 = (${M1} × ${V1}) / ${M2} = ${ans.toFixed(4)} L`, m1: M1, v1: V1, m2: M2, v2: ans };
      }
    } catch (e) {
      return { err: 'Calculation error' };
    }
  };

  const molarRes = solveMolarity();
  const dilRes = solveDilution();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '3px', borderRadius: '8px', alignSelf: 'flex-start', border: '1px solid rgba(255,255,255,0.03)' }}>
        {[
          { id: 'molarity', label: 'Molarity Solver' },
          { id: 'dilution', label: 'Dilution Solver (M₁V₁ = M₂V₂)' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setMode(t.id)}
            style={{
              padding: '6px 12px',
              fontSize: '0.72rem',
              background: mode === t.id ? 'rgba(255,255,255,0.06)' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: mode === t.id ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {mode === 'molarity' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="grid-mobile-1fr">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px 0' }}>
                <Atom size={16} style={{ color: '#06b6d4' }} />
                Molarity &amp; Solute Mass Solver
              </h3>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Select a target parameter to solve by clicking its button, then adjust the other variables.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Solve Target</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {[
                  { id: 'M', name: 'Molarity (M)' },
                  { id: 'n', name: 'Moles (n)' },
                  { id: 'V', name: 'Volume (V)' },
                  { id: 'g', name: 'Mass (g)' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setMolTarget(t.id)}
                    className="btn-glow"
                    style={{
                      padding: '6px 4px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      background: molTarget === t.id ? `${accentColor}18` : 'rgba(255,255,255,0.02)',
                      border: molTarget === t.id ? `1px solid ${accentColor}40` : '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '8px',
                      color: molTarget === t.id ? accentColor : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {molTarget !== 'M' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Molarity (mol/L)</label>
                  <input type="number" step="0.01" value={molarity} onChange={(e) => setMolarity(e.target.value)} className="glass-input" style={{ fontSize: '0.78rem' }} />
                </div>
              )}

              {molTarget !== 'n' && molTarget !== 'g' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Moles (mol)</label>
                  <input type="number" step="0.01" value={moles} onChange={(e) => setMoles(e.target.value)} className="glass-input" style={{ fontSize: '0.78rem' }} />
                </div>
              )}

              {molTarget !== 'V' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Volume (L)</label>
                  <input type="number" step="0.1" value={volume} onChange={(e) => setVolume(e.target.value)} className="glass-input" style={{ fontSize: '0.78rem' }} />
                </div>
              )}

              {(molTarget === 'g' || molTarget === 'M' || molTarget === 'n') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Molecular Weight (g/mol)</label>
                  <input type="number" step="0.1" value={molWeight} onChange={(e) => setMolWeight(e.target.value)} className="glass-input" style={{ fontSize: '0.78rem' }} />
                </div>
              )}

              {molTarget !== 'g' && molTarget !== 'M' && molTarget !== 'n' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Solute Mass (g)</label>
                  <input type="number" step="0.1" value={mass} onChange={(e) => setMass(e.target.value)} className="glass-input" style={{ fontSize: '0.78rem' }} />
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Calculation Results</span>
              
              {molarRes.err ? (
                <div style={{ fontSize: '0.75rem', color: '#ff3366', fontWeight: 600 }}>{molarRes.err}</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Solved {molTarget === 'M' ? 'Molarity' : molTarget === 'n' ? 'Moles' : molTarget === 'V' ? 'Volume' : 'Solute Mass'}:</span>
                    <span className="math-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: accentColor, marginTop: '2px' }}>
                      {molarRes.val}
                    </span>
                  </div>
                  
                  {molarRes.massVal && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Required Solute Mass:</span>
                      <span className="math-mono" style={{ fontWeight: 600, color: '#fff' }}>{molarRes.massVal}</span>
                    </div>
                  )}

                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    Equation: {molarRes.details}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="grid-mobile-1fr">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px 0' }}>
                <Atom size={16} style={{ color: '#06b6d4' }} />
                Molar Dilution Solver
              </h3>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Solve options by clicking standard parameter tags. Changing concentrations updates visual beaker levels and color densities.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Solve Target</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {[
                  { id: 'M1', name: 'Stock Molarity (M₁)' },
                  { id: 'V1', name: 'Stock Volume (V₁)' },
                  { id: 'M2', name: 'Diluted Molarity (M₂)' },
                  { id: 'V2', name: 'Diluted Volume (V₂)' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setDilTarget(t.id)}
                    className="btn-glow"
                    style={{
                      padding: '6px 2px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      background: dilTarget === t.id ? `${accentColor}18` : 'rgba(255,255,255,0.02)',
                      border: dilTarget === t.id ? `1px solid ${accentColor}40` : '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '8px',
                      color: dilTarget === t.id ? accentColor : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {dilTarget !== 'M1' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Stock Molarity (M₁)</label>
                  <input type="number" step="0.1" value={m1} onChange={(e) => setM1(e.target.value)} className="glass-input" style={{ fontSize: '0.78rem' }} />
                </div>
              )}
              {dilTarget !== 'V1' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Stock Volume (V₁)</label>
                  <input type="number" step="0.05" value={v1} onChange={(e) => setV1(e.target.value)} className="glass-input" style={{ fontSize: '0.78rem' }} />
                </div>
              )}
              {dilTarget !== 'M2' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Diluted Molarity (M₂)</label>
                  <input type="number" step="0.1" value={m2} onChange={(e) => setM2(e.target.value)} className="glass-input" style={{ fontSize: '0.78rem' }} />
                </div>
              )}
              {dilTarget !== 'V2' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Diluted Volume (V₂)</label>
                  <input type="number" step="0.1" value={v2} onChange={(e) => setV2(e.target.value)} className="glass-input" style={{ fontSize: '0.78rem' }} />
                </div>
              )}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '10px 14px', marginTop: '4px' }}>
              {dilRes.err ? (
                <div style={{ fontSize: '0.72rem', color: '#ff3366', fontWeight: 600 }}>{dilRes.err}</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Solved Output:</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: accentColor }}>{dilRes.val}</div>
                  <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>Formula: {dilRes.details}</div>
                </div>
              )}
            </div>
          </div>

          <div style={{ background: 'rgba(5,7,12,0.6)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '14px', padding: '12px', display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
            {!dilRes.err && (
              <>
                <BeakerVisual
                  label="Stock Solution"
                  volume={dilRes.v1}
                  concentration={dilRes.m1}
                  maxVolume={Math.max(dilRes.v1, dilRes.v2, 2.0)}
                  maxConcentration={Math.max(dilRes.m1, dilRes.m2, 12.0)}
                  accentColor={accentColor}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: 'rgba(255,255,255,0.15)' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 700 }}>+ H₂O</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>➡</span>
                </div>
                <BeakerVisual
                  label="Diluted Product"
                  volume={dilRes.v2}
                  concentration={dilRes.m2}
                  maxVolume={Math.max(dilRes.v1, dilRes.v2, 2.0)}
                  maxConcentration={Math.max(dilRes.m1, dilRes.m2, 12.0)}
                  accentColor={accentColor}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BeakerVisual({ label, volume, concentration, maxVolume = 2.0, maxConcentration = 12.0, accentColor }) {
  const volRatio = Math.max(0.02, Math.min(volume / maxVolume, 1));
  const concRatio = Math.max(0.01, Math.min(concentration / maxConcentration, 1));
  
  const opacity = 0.05 + Math.pow(concRatio, 0.6) * 0.85;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <svg width="76" height="106" viewBox="0 0 100 130" style={{ overflow: 'visible' }}>
        <path d={`M 22,${126 - volRatio * 96} L 78,${126 - volRatio * 96} L 78,118 A 6,6 0 0,1 72,126 L 28,126 A 6,6 0 0,1 22,118 Z`}
          fill={accentColor} opacity={opacity} style={{ transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)' }} />
        
        <path d="M 20,20 L 20,120 A 8,8 0 0,0 28,128 L 72,128 A 8,8 0 0,0 80,120 L 80,20 M 15,20 L 85,20" 
          fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
        
        <line x1="20" y1="42" x2="30" y2="42" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <line x1="20" y1="66" x2="35" y2="66" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <line x1="20" y1="90" x2="30" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <line x1="20" y1="114" x2="30" y2="114" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.65rem', gap: '2px' }}>
        <span style={{ fontWeight: 700, color: '#fff' }}>{volume.toFixed(3)} L</span>
        <span style={{ color: 'var(--text-secondary)' }}>{concentration.toFixed(3)} M</span>
      </div>
    </div>
  );
}

// ─── IDEAL GAS LAW SOLVER COMPONENT ───────────────────────────────────────────
function IdealGasSolver({ accentColor }) {
  const [target, setTarget] = useState('P');
  const [pVal, setPVal] = useState('1.0');
  const [pUnit, setPUnit] = useState('atm');
  const [vVal, setVVal] = useState('22.414');
  const [vUnit, setVUnit] = useState('L');
  const [nVal, setNVal] = useState('1.0');
  const [nUnit, setNUnit] = useState('mol');
  const [tVal, setTVal] = useState('273.15');
  const [tUnit, setTUnit] = useState('K');

  const toBasePressure = (val, unit) => {
    const v = parseFloat(val) || 0;
    switch (unit) {
      case 'atm': return v;
      case 'Pa': return v / 101325;
      case 'kPa': return v / 101.325;
      case 'bar': return v / 1.01325;
      case 'psi': return v / 14.69595;
      case 'mmHg': return v / 760;
      default: return v;
    }
  };
  const fromBasePressure = (v, unit) => {
    switch (unit) {
      case 'atm': return v;
      case 'Pa': return v * 101325;
      case 'kPa': return v * 101.325;
      case 'bar': return v * 1.01325;
      case 'psi': return v * 14.69595;
      case 'mmHg': return v * 760;
      default: return v;
    }
  };

  const toBaseVolume = (val, unit) => {
    const v = parseFloat(val) || 0;
    switch (unit) {
      case 'L': return v;
      case 'mL': return v * 0.001;
      case 'm³': return v * 1000;
      case 'uL': return v * 1e-6;
      default: return v;
    }
  };
  const fromBaseVolume = (v, unit) => {
    switch (unit) {
      case 'L': return v;
      case 'mL': return v * 1000;
      case 'm³': return v * 0.001;
      case 'uL': return v * 1e6;
      default: return v;
    }
  };

  const toBaseMoles = (val, unit) => {
    const v = parseFloat(val) || 0;
    switch (unit) {
      case 'mol': return v;
      case 'mmol': return v * 0.001;
      default: return v;
    }
  };
  const fromBaseMoles = (v, unit) => {
    switch (unit) {
      case 'mol': return v;
      case 'mmol': return v * 1000;
      default: return v;
    }
  };

  const toBaseTemp = (val, unit) => {
    const v = parseFloat(val) || 0;
    switch (unit) {
      case 'K': return v;
      case '°C': return v + 273.15;
      case '°F': return (v - 32) * 5/9 + 273.15;
      default: return v;
    }
  };
  const fromBaseTemp = (v, unit) => {
    switch (unit) {
      case 'K': return v;
      case '°C': return v - 273.15;
      case '°F': return (v - 273.15) * 9/5 + 32;
      default: return v;
    }
  };

  const solveGasLaw = () => {
    const R = 0.08205736;
    try {
      if (target === 'P') {
        const V = toBaseVolume(vVal, vUnit);
        const n = toBaseMoles(nVal, nUnit);
        const T = toBaseTemp(tVal, tUnit);
        if (V <= 0) return { err: 'Volume must be positive' };
        if (T <= 0) return { err: 'Temperature must be above absolute zero' };
        const ansBase = (n * R * T) / V;
        const solved = fromBasePressure(ansBase, pUnit);
        return {
          val: solved.toLocaleString(undefined, { maximumFractionDigits: 5 }) + ' ' + pUnit,
          details: `P = nRT / V = (${n.toFixed(4)} × 0.08206 × ${T.toFixed(2)}) / ${V.toFixed(4)} = ${ansBase.toFixed(4)} atm`
        };
      } else if (target === 'V') {
        const P = toBasePressure(pVal, pUnit);
        const n = toBaseMoles(nVal, nUnit);
        const T = toBaseTemp(tVal, tUnit);
        if (P <= 0) return { err: 'Pressure must be positive' };
        if (T <= 0) return { err: 'Temperature must be above absolute zero' };
        const ansBase = (n * R * T) / P;
        const solved = fromBaseVolume(ansBase, vUnit);
        return {
          val: solved.toLocaleString(undefined, { maximumFractionDigits: 5 }) + ' ' + vUnit,
          details: `V = nRT / P = (${n.toFixed(4)} × 0.08206 × ${T.toFixed(2)}) / ${P.toFixed(4)} = ${ansBase.toFixed(4)} L`
        };
      } else if (target === 'n') {
        const P = toBasePressure(pVal, pUnit);
        const V = toBaseVolume(vVal, vUnit);
        const T = toBaseTemp(tVal, tUnit);
        if (T <= 0) return { err: 'Temperature must be above absolute zero' };
        const ansBase = (P * V) / (R * T);
        const solved = fromBaseMoles(ansBase, nUnit);
        return {
          val: solved.toLocaleString(undefined, { maximumFractionDigits: 5 }) + ' ' + nUnit,
          details: `n = PV / RT = (${P.toFixed(4)} × ${V.toFixed(4)}) / (0.08206 × ${T.toFixed(2)}) = ${ansBase.toFixed(4)} mol`
        };
      } else if (target === 'T') {
        const P = toBasePressure(pVal, pUnit);
        const V = toBaseVolume(vVal, vUnit);
        const n = toBaseMoles(nVal, nUnit);
        if (n <= 0) return { err: 'Moles count must be positive' };
        const ansBase = (P * V) / (n * R);
        const solved = fromBaseTemp(ansBase, tUnit);
        return {
          val: solved.toLocaleString(undefined, { maximumFractionDigits: 3 }) + ' ' + tUnit,
          details: `T = PV / nR = (${P.toFixed(4)} × ${V.toFixed(4)}) / (${n.toFixed(4)} × 0.08206) = ${ansBase.toFixed(2)} K`
        };
      }
    } catch (e) {
      return { err: 'Calculation error' };
    }
  };

  const res = solveGasLaw();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="grid-mobile-1fr">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px 0' }}>
            <Thermometer size={16} style={{ color: '#8b5cf6' }} />
            Ideal Gas Law Solver (PV = nRT)
          </h3>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Select the variable you want to calculate, enter the other three parameters, and select your preferred units.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Solve Target</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            {[
              { id: 'P', name: 'Pressure (P)' },
              { id: 'V', name: 'Volume (V)' },
              { id: 'n', name: 'Substance (n)' },
              { id: 'T', name: 'Temp (T)' }
            ].map(v => (
              <button
                key={v.id}
                onClick={() => setTarget(v.id)}
                className="btn-glow"
                style={{
                  padding: '6px 2px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  background: target === v.id ? `${accentColor}18` : 'rgba(255,255,255,0.02)',
                  border: target === v.id ? `1px solid ${accentColor}40` : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '8px',
                  color: target === v.id ? accentColor : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {target !== 'P' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Pressure (P)</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="number" step="0.1" value={pVal} onChange={(e) => setPVal(e.target.value)} className="glass-input" style={{ flex: 1, fontSize: '0.78rem' }} />
                <select value={pUnit} onChange={(e) => setPUnit(e.target.value)} className="glass-input" style={{ fontSize: '0.72rem', cursor: 'pointer', padding: '4px' }}>
                  {['atm', 'Pa', 'kPa', 'bar', 'psi', 'mmHg'].map(u => (
                    <option key={u} value={u} style={{ background: '#0a0c16' }}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {target !== 'V' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Volume (V)</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="number" step="0.5" value={vVal} onChange={(e) => setVVal(e.target.value)} className="glass-input" style={{ flex: 1, fontSize: '0.78rem' }} />
                <select value={vUnit} onChange={(e) => setVUnit(e.target.value)} className="glass-input" style={{ fontSize: '0.72rem', cursor: 'pointer', padding: '4px' }}>
                  {['L', 'mL', 'm³', 'uL'].map(u => (
                    <option key={u} value={u} style={{ background: '#0a0c16' }}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {target !== 'n' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Substance Amount (n)</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="number" step="0.1" value={nVal} onChange={(e) => setNVal(e.target.value)} className="glass-input" style={{ flex: 1, fontSize: '0.78rem' }} />
                <select value={nUnit} onChange={(e) => setNUnit(e.target.value)} className="glass-input" style={{ fontSize: '0.72rem', cursor: 'pointer', padding: '4px' }}>
                  {['mol', 'mmol'].map(u => (
                    <option key={u} value={u} style={{ background: '#0a0c16' }}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {target !== 'T' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Temperature (T)</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="number" step="5" value={tVal} onChange={(e) => setTVal(e.target.value)} className="glass-input" style={{ flex: 1, fontSize: '0.78rem' }} />
                <select value={tUnit} onChange={(e) => setTUnit(e.target.value)} className="glass-input" style={{ fontSize: '0.72rem', cursor: 'pointer', padding: '4px' }}>
                  {['K', '°C', '°F'].map(u => (
                    <option key={u} value={u} style={{ background: '#0a0c16' }}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Calculation Output</span>
          
          {res.err ? (
            <div style={{ fontSize: '0.75rem', color: '#ff3366', fontWeight: 600 }}>{res.err}</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Solved {target === 'P' ? 'Gas Pressure' : target === 'V' ? 'Gas Volume' : target === 'n' ? 'Substance Amount' : 'Temperature'}:</span>
                <span className="math-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: accentColor, marginTop: '2px' }}>
                  {res.val}
                </span>
              </div>
              
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'monospace', lineHeight: 1.45 }}>
                Conversion &amp; Calculation Ledger:<br />
                {res.details}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ELECTROMAGNETIC SPECTROSCOPY SIMULATOR COMPONENT ──────────────────────────
function SpectroscopySimulator({ accentColor }) {
  const [wavelength, setWavelength] = useState('656.28'); // nm
  const [frequency, setFrequency] = useState('456.79'); // THz
  const [energyEv, setEnergyEv] = useState('1.889'); // eV
  const [energyJ, setEnergyJ] = useState('3.027e-19'); // Joules
  const [activeBand, setActiveBand] = useState('Visible Light');
  const [lightColor, setLightColor] = useState('rgb(255, 0, 0)');
  const [sliderVal, setSliderVal] = useState(2.817); // log10(656.28) = 2.817

  // Presets list
  const presets = [
    { name: 'Gamma: Cobalt-60 Decay', wl: 0.00106 },
    { name: 'X-Ray: Medical Imaging', wl: 0.12 },
    { name: 'UV: Lyman-Alpha (H)', wl: 121.57 },
    { name: 'Visible: Balmer-Beta (Cyan)', wl: 486.13 },
    { name: 'Visible: Balmer-Alpha (Red)', wl: 656.28 },
    { name: 'Visible: Sodium D-Lines', wl: 589.0 },
    { name: 'IR: Greenhouse Heat', wl: 10000.0 },
    { name: 'Microwave: 5G Network', wl: 10000000.0 },
    { name: 'Radio: FM Radio 100 MHz', wl: 3000000000.0 }
  ];

  function getWavelengthColor(wl) {
    if (wl < 380 || wl > 780) return 'rgba(255, 255, 255, 0.15)';
    let r = 0, g = 0, b = 0;
    if (wl >= 380 && wl < 440) {
      r = -(wl - 440) / (440 - 380);
      g = 0.0;
      b = 1.0;
    } else if (wl >= 440 && wl < 490) {
      r = 0.0;
      g = (wl - 440) / (490 - 440);
      b = 1.0;
    } else if (wl >= 490 && wl < 510) {
      r = 0.0;
      g = 1.0;
      b = -(wl - 510) / (510 - 490);
    } else if (wl >= 510 && wl < 580) {
      r = (wl - 510) / (580 - 510);
      g = 1.0;
      b = 0.0;
    } else if (wl >= 580 && wl < 645) {
      r = 1.0;
      g = -(wl - 645) / (645 - 580);
      b = 0.0;
    } else if (wl >= 645 && wl <= 780) {
      r = 1.0;
      g = 0.0;
      b = 0.0;
    }
    let factor = 1.0;
    if (wl >= 380 && wl < 420) {
      factor = 0.3 + 0.7 * (wl - 380) / (420 - 380);
    } else if (wl > 700 && wl <= 780) {
      factor = 0.3 + 0.7 * (780 - wl) / (780 - 700);
    }
    return `rgb(${Math.round(r * factor * 255)}, ${Math.round(g * factor * 255)}, ${Math.round(b * factor * 255)})`;
  }

  const syncBandAndColor = (wl) => {
    let band = 'Radio Wave';
    if (wl < 0.01) band = 'Gamma Ray';
    else if (wl >= 0.01 && wl < 10) band = 'X-Ray';
    else if (wl >= 10 && wl < 380) band = 'Ultraviolet (UV)';
    else if (wl >= 380 && wl <= 780) band = 'Visible Light';
    else if (wl > 780 && wl <= 1000000) band = 'Infrared (IR)';
    else if (wl > 1000000 && wl <= 1000000000) band = 'Microwave';
    setActiveBand(band);
    setLightColor(getWavelengthColor(wl));
  };

  const updateFromWavelength = (valStr) => {
    setWavelength(valStr);
    const wl = parseFloat(valStr);
    if (!isNaN(wl) && wl > 0) {
      const freq = 299792.458 / wl;
      const ev = 1239.84193 / wl;
      const joules = ev * 1.602176634e-19;
      setFrequency(freq.toFixed(4));
      setEnergyEv(ev.toFixed(5));
      setEnergyJ(joules.toExponential(4));
      setSliderVal(Math.log10(wl));
      syncBandAndColor(wl);
    }
  };

  const updateFromFrequency = (valStr) => {
    setFrequency(valStr);
    const freq = parseFloat(valStr);
    if (!isNaN(freq) && freq > 0) {
      const wl = 299792.458 / freq;
      const ev = freq * 4.13566733e-3;
      const joules = ev * 1.602176634e-19;
      setWavelength(wl.toFixed(4));
      setEnergyEv(ev.toFixed(5));
      setEnergyJ(joules.toExponential(4));
      setSliderVal(Math.log10(wl));
      syncBandAndColor(wl);
    }
  };

  const updateFromEnergyEv = (valStr) => {
    setEnergyEv(valStr);
    const ev = parseFloat(valStr);
    if (!isNaN(ev) && ev > 0) {
      const wl = 1239.84193 / ev;
      const freq = ev / 4.13566733e-3;
      const joules = ev * 1.602176634e-19;
      setWavelength(wl.toFixed(4));
      setFrequency(freq.toFixed(4));
      setEnergyJ(joules.toExponential(4));
      setSliderVal(Math.log10(wl));
      syncBandAndColor(wl);
    }
  };

  const handleSliderChange = (logVal) => {
    setSliderVal(logVal);
    const wl = Math.pow(10, logVal);
    setWavelength(wl.toFixed(4));
    const freq = 299792.458 / wl;
    const ev = 1239.84193 / wl;
    const joules = ev * 1.602176634e-19;
    setFrequency(freq.toFixed(4));
    setEnergyEv(ev.toFixed(5));
    setEnergyJ(joules.toExponential(4));
    syncBandAndColor(wl);
  };

  const wlNum = parseFloat(wavelength) || 656.28;
  const sliderPercentage = ((sliderVal - (-4)) / (9.5 - (-4))) * 100; // range log10: -4 (0.0001 nm) to 9.5 (3,162,277,660 nm)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="grid-mobile-1fr">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px 0' }}>
            <Waves size={16} style={{ color: '#ec4899' }} />
            Electromagnetic Spectroscopy Simulator
          </h3>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>
            Analyze photon kinetics by editing parameters or dragging the EM spectrum slider. Wavelength maps dynamically to visible light and spectroscopy lines.
          </p>
        </div>

        {/* Dynamic Inputs grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Wavelength (λ, nm)</label>
            <input type="number" step="any" value={wavelength} onChange={e => updateFromWavelength(e.target.value)} className="glass-input" style={{ fontSize: '0.78rem' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Frequency (ν, THz)</label>
            <input type="number" step="any" value={frequency} onChange={e => updateFromFrequency(e.target.value)} className="glass-input" style={{ fontSize: '0.78rem' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Photon Energy (eV)</label>
            <input type="number" step="any" value={energyEv} onChange={e => updateFromEnergyEv(e.target.value)} className="glass-input" style={{ fontSize: '0.78rem' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Photon Energy (Joules, J)</label>
            <input type="text" readOnly value={energyJ} className="glass-input" style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)' }} />
          </div>
        </div>

        {/* Logarithmic Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '8px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            <span>Gamma Rays (0.0001 nm)</span>
            <span>Radio (3 m)</span>
          </div>
          <input
            type="range"
            min="-4"
            max="9.5"
            step="0.005"
            value={sliderVal}
            onChange={e => handleSliderChange(parseFloat(e.target.value))}
            style={{
              width: '100%',
              cursor: 'ew-resize',
              accentColor: lightColor !== 'rgba(255, 255, 255, 0.15)' ? lightColor : accentColor
            }}
          />
        </div>

        {/* Presets Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Spectroscopy Presets</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', maxHeight: '105px', overflowY: 'auto', paddingRight: '2px' }}>
            {presets.map(p => (
              <button
                key={p.name}
                onClick={() => updateFromWavelength(p.wl.toString())}
                className="btn-glow"
                style={{
                  padding: '4px 8px',
                  fontSize: '0.62rem',
                  fontWeight: 600,
                  background: Math.abs(parseFloat(wavelength) - p.wl) < 0.05 ? `${accentColor}18` : 'rgba(255,255,255,0.02)',
                  border: Math.abs(parseFloat(wavelength) - p.wl) < 0.05 ? `1px solid ${accentColor}40` : '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '6px',
                  color: Math.abs(parseFloat(wavelength) - p.wl) < 0.05 ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Spectra side panel */}
      <div style={{ background: 'rgba(5,7,12,0.4)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
          <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>EM Spectrum Classification</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{activeBand}</span>
            {activeBand === 'Visible Light' && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 8px', background: `${lightColor}18`, border: `1px solid ${lightColor}40`, borderRadius: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: lightColor }} />
                <span style={{ fontSize: '0.62rem', fontWeight: 700, color: lightColor }}>{Math.round(wlNum)} nm</span>
              </div>
            )}
          </div>
        </div>

        {/* EM Continuous Spectrum Visualizer bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>EM Band Spectrum Marker:</span>
          <div style={{ position: 'relative', width: '100%', height: '22px', borderRadius: '6px', background: 'linear-gradient(to right, #2a0845 0%, #1d2b64 15%, #0f2027 30%, #203a43 38%, #7f00ff 42%, #0000ff 45%, #00ff00 48%, #ffff00 51%, #ff7f00 54%, #ff0000 57%, #3e0c0c 62%, #141518 78%, #0f0c20 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Sliding pointer */}
            <div style={{
              position: 'absolute',
              left: `${Math.min(99, Math.max(0.5, sliderPercentage))}%`,
              top: '-3px',
              width: '4px',
              height: '28px',
              background: '#fff',
              borderRadius: '2px',
              boxShadow: '0 0 10px #fff',
              transform: 'translateX(-50%)',
              transition: 'left 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)'
            }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', fontSize: '0.45rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2px' }}>
            <span>Gamma</span>
            <span>X-Ray</span>
            <span>UV</span>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Visible</span>
            <span>IR</span>
            <span>Micro</span>
            <span>Radio</span>
          </div>
        </div>

        {/* Simulated Emission Spectrum */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
          <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>Simulated Emission Lines (Visible Band):</span>
          <div style={{ position: 'relative', width: '100%', height: '22px', background: '#000', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            {/* Static Hydrogen lines for visual guidance */}
            <div style={{ position: 'absolute', left: '10%', width: '1px', height: '100%', background: '#7f00ff', opacity: 0.25 }} title="H-delta: 410.2 nm" />
            <div style={{ position: 'absolute', left: '20%', width: '1px', height: '100%', background: '#0000ff', opacity: 0.25 }} title="H-gamma: 434.0 nm" />
            <div style={{ position: 'absolute', left: '42%', width: '1px', height: '100%', background: '#00ffff', opacity: 0.25 }} title="H-beta: 486.1 nm" />
            <div style={{ position: 'absolute', left: '88%', width: '1px', height: '100%', background: '#ff0000', opacity: 0.25 }} title="H-alpha: 656.3 nm" />
            
            {/* Active Emission Line */}
            {wlNum >= 380 && wlNum <= 780 && (
              <div style={{
                position: 'absolute',
                left: `${((wlNum - 380) / (780 - 380)) * 100}%`,
                width: '3px',
                height: '100%',
                background: lightColor,
                boxShadow: `0 0 8px ${lightColor}`,
                transform: 'translateX(-50%)',
                transition: 'left 0.15s ease'
              }} />
            )}
          </div>
        </div>

        {/* Simulated Absorption Spectrum */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>Simulated Absorption Lines (Visible Band):</span>
          <div style={{ position: 'relative', width: '100%', height: '22px', background: 'linear-gradient(to right, #7f00ff 0%, #0000ff 25%, #00ff00 50%, #ffff00 68%, #ff7f00 82%, #ff0000 100%)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            {/* Active Absorption Line */}
            {wlNum >= 380 && wlNum <= 780 && (
              <div style={{
                position: 'absolute',
                left: `${((wlNum - 380) / (780 - 380)) * 100}%`,
                width: '3px',
                height: '100%',
                background: '#000',
                transform: 'translateX(-50%)',
                transition: 'left 0.15s ease'
              }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ChemistryCalculator() {
  const { getAccentColor } = useApp();
  const accentColor = getAccentColor('chemistry');
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('molar-mass');

  const [formula, setFormula] = useState('H2SO4');
  const [molResult, setMolResult] = useState(null);
  const [molError, setMolError] = useState('');

  const calculateMolecularMass = (formStr) => {
    if (!formStr.trim()) { setMolResult(null); setMolError(''); return; }
    try {
      const counts = parseChemicalFormula(formStr.trim()); let totalMass = 0; const breakdown = [];
      for (const [symbol, count] of Object.entries(counts)) {
        const mass = fullMassLookup[symbol];
        if (mass === undefined) throw new Error(`Unknown element symbol: "${symbol}"`);
        const elementTotal = mass * count; totalMass += elementTotal;
        breakdown.push({ symbol, count, unitMass: mass, totalMass: elementTotal });
      }
      if (breakdown.length === 0) throw new Error('Formula parsed empty. Try H2O or Ca(OH)2.');
      const finalBreakdown = breakdown.map(item => ({ ...item, percentage: (item.totalMass / totalMass) * 100 })).sort((a, b) => b.totalMass - a.totalMass);
      setMolResult({ totalMass, breakdown: finalBreakdown }); setMolError('');
    } catch (e) { setMolResult(null); setMolError(e.message || 'Parsing error'); }
  };

  useEffect(() => { calculateMolecularMass(formula); }, [formula]);

  return (
    <div className="animate-slide chemistry-scroll" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px', padding: '8px', overflowY: 'auto' }}>
      <style dangerouslySetInnerHTML={{ __html: animStyles }} />

      {/* Element detail modal overlay */}
      {selectedElement && !selectedElement.isPlaceholder && (
        <ElementModal element={selectedElement} onClose={() => setSelectedElement(null)} categories={elementCategories} />
      )}

      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#fff' }}>Chemistry Laboratory</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
          Interactive Periodic Table (118 Elements) — click any element for full details &amp; electron shell diagram
        </p>
      </div>

      {/* Periodic Table */}
      <div className="glass-panel" style={{ padding: '20px', background: 'rgba(16,20,35,0.35)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px 0' }}>
            <Atom size={18} style={{ color: accentColor }} />
            Periodic Table of Elements
          </h3>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Click any element to reveal its full atomic properties, electron shell diagram, discovery history, and applications.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(18, minmax(36px, 1fr))', gridTemplateRows: 'repeat(10, minmax(42px, 1fr))',
          gap: '4px', padding: '8px', background: 'rgba(5,7,12,0.5)', borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.04)', minHeight: '460px', overflowX: 'auto' }}>
          {elementsData.map((el) => {
            const cat = elementCategories[el.category] || { color: '#8c92ac', shadow: 'none' };
            const isSelected = selectedElement?.number === el.number;
            return (
              <div key={`${el.number}-${el.symbol}`}
                onClick={() => setSelectedElement(el)}
                style={{ gridRow: el.period, gridColumn: el.group, borderRadius: '6px',
                  border: isSelected ? `2px solid ${cat.color}` : '1px solid rgba(255,255,255,0.05)',
                  background: isSelected ? `${cat.color}22` : 'rgba(255,255,255,0.02)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all var(--transition-fast)', padding: '2px',
                  boxShadow: isSelected ? `0 0 14px ${cat.shadow}` : 'none', minWidth: '34px', minHeight: '40px' }}
                className="element-card btn-glow"
                title={el.isPlaceholder ? el.name : `${el.name} — ${el.mass} u — click for details`}
              >
                <span style={{ fontSize: '0.52rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', lineHeight: 1 }}>{el.number}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: cat.color, lineHeight: 1.1 }}>{el.symbol}</span>
                <span style={{ fontSize: '0.42rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', textAlign: 'center' }}>{el.name}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 14px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
          {Object.entries(elementCategories).map(([key, val]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: val.color }} />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{val.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-modules Navigation Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '8px',
        padding: '6px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        marginTop: '8px',
        width: '100%'
      }}>
        {[
          { id: 'molar-mass', name: 'Molar Mass', icon: <Scale size={14} />, color: '#f43f5e' },
          { id: 'balancer', name: 'Equation Balancer', icon: <RefreshCw size={14} />, color: '#10b981' },
          { id: 'decay', name: 'Radioactive Decay', icon: <Activity size={14} />, color: '#fbbf24' },
          { id: 'dilution', name: 'Molar Dilution', icon: <Atom size={14} />, color: '#06b6d4' },
          { id: 'gas-law', name: 'Ideal Gas Law', icon: <Thermometer size={14} />, color: '#8b5cf6' },
          { id: 'spectroscopy', name: 'EM Spectroscopy', icon: <Waves size={14} />, color: '#ec4899' }
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: isActive ? `${accentColor}26` : 'rgba(255, 255, 255, 0.02)',
                border: isActive ? `1px solid ${accentColor}` : '1px solid var(--border-color)',
                borderRadius: '20px',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? `0 0 12px ${accentColor}40` : 'none',
                width: '100%'
              }}
              className="btn-glow"
            >
              <span style={{ color: isActive ? accentColor : 'rgba(255, 255, 255, 0.4)', display: 'inline-flex', alignItems: 'center' }}>
                {tab.icon}
              </span>
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Conditional Sub-module Renderer */}
      <div className="glass-panel" style={{ padding: '20px', background: 'rgba(16,20,35,0.45)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {activeSubTab === 'molar-mass' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px 0' }}>
                <Scale size={16} style={{ color: accentColor }} />
                Molecular Weight Calculator
              </h3>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Input chemical formulas with dynamic counts — supports nested groups like Ca(OH)₂</p>
            </div>
            <input type="text" placeholder="Ca(OH)2 or C6H12O6" value={formula}
              onChange={(e) => setFormula(e.target.value)} className="glass-input"
              style={{ fontSize: '0.88rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }} />

            {molResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Molar Mass:</span>
                  <span className="math-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: accentColor }}>
                    {molResult.totalMass.toFixed(3)} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#fff' }}>g/mol</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto', paddingRight: '4px' }}>
                  {molResult.breakdown.map((item) => (
                    <div key={item.symbol} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span style={{ fontWeight: 600, color: '#fff' }}>{item.symbol} × {item.count}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{item.totalMass.toFixed(2)} g ({item.percentage.toFixed(1)}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.percentage}%`, height: '100%', background: elementCategories[elementsData.find(e => e.symbol === item.symbol)?.category]?.color || accentColor }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {molError && <div style={{ fontSize: '0.75rem', color: '#ff3366', fontWeight: 500, marginTop: '4px' }}>{molError}</div>}
          </div>
        )}

        {activeSubTab === 'balancer' && (
          <ChemicalBalancer accentColor={accentColor} />
        )}

        {activeSubTab === 'decay' && (
          <RadioactiveDecayTimeline accentColor={accentColor} />
        )}

        {activeSubTab === 'dilution' && (
          <DilutionSolver accentColor={accentColor} />
        )}

        {activeSubTab === 'gas-law' && (
          <IdealGasSolver accentColor={accentColor} />
        )}

        {activeSubTab === 'spectroscopy' && (
          <SpectroscopySimulator accentColor={accentColor} />
        )}
      </div>
    </div>
  );
}
