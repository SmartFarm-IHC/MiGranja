window.MiGranjaMock = Object.freeze({
  user: { name: 'Carlos Mendoza', role: 'Propietario', farm: 'Granja San Carlos', email: 'carlos@email.com' },
  animals: [
    { code: 'BOV-001', breed: 'Angus', sex: 'Macho', lot: 'Lote Norte', location: 'Corral 2' },
    { code: 'BOV-002', breed: 'Holstein', sex: 'Hembra', lot: 'Lote Norte', location: 'Corral 2' },
    { code: 'BOV-003', breed: 'Angus', sex: 'Macho', lot: 'Lote Sur', location: 'Corral 4' }
  ],
  lots: [{ name: 'Lote Norte', count: 42, location: 'Corral 2' }, { name: 'Lote Sur', count: 35, location: 'Corral 4' }]
});
