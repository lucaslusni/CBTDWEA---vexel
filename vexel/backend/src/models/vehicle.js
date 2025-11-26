// Classe de dominio para veiculo da frota
export class Vehicle {
  constructor({ id, plate, model, brand, year, status = "active", mileage = 0, updatedAt = null }) {
    this._id = id ?? plate;
    this._plate = plate;
    this._model = model;
    this._brand = brand;
    this._year = year;
    this._status = status;
    this._mileage = mileage ?? 0;
    this._updatedAt = updatedAt ?? new Date().toISOString();
  }

  // getters e setters basicos
  get id() { return this._id; }
  get plate() { return this._plate; }
  set plate(value) { this._plate = value; }

  get model() { return this._model; }
  set model(value) { this._model = value; }

  get brand() { return this._brand; }
  set brand(value) { this._brand = value; }

  get year() { return this._year; }
  set year(value) { this._year = value; }

  get status() { return this._status; }
  set status(value) { this._status = value; }

  get mileage() { return this._mileage; }
  set mileage(value) { this._mileage = value ?? 0; }

  get updatedAt() { return this._updatedAt; }
  set updatedAt(value) { this._updatedAt = value ?? new Date().toISOString(); }

  // cria uma instancia a partir de um objeto "plain"
  static fromPlain(data = {}) {
    return new Vehicle(data);
  }

  // retorna uma copia em formato JSON para salvar ou enviar
  toPlain(includeId = true) {
    const base = {
      plate: this.plate,
      model: this.model,
      brand: this.brand,
      year: this.year,
      status: this.status,
      mileage: this.mileage,
      updatedAt: this.updatedAt
    };
    return includeId ? { id: this.id, ...base } : base;
  }

  // aplica um patch e devolve uma nova instancia com updatedAt atualizado
  withPatch(patch = {}) {
    return new Vehicle({
      id: this.id,
      plate: this.plate, // ID segue sendo a placa
      model: patch.model ?? this.model,
      brand: patch.brand ?? this.brand,
      year: patch.year ?? this.year,
      status: patch.status ?? this.status,
      mileage: patch.mileage ?? this.mileage,
      updatedAt: new Date().toISOString()
    });
  }

  // pequeno helper de dominio
  get age() {
    const currentYear = new Date().getFullYear();
    return this.year ? currentYear - this.year : null;
  }
}
