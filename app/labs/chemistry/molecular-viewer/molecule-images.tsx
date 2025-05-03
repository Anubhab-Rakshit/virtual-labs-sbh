"\"use client"

import {
  MoleculeWater,
  MoleculeMethane,
  MoleculeAmmonia,
  MoleculeOxygen,
  MoleculeCarbonDioxide,
} from "./molecule-collection"

export const MoleculeImages = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-2">Water (H₂O)</h3>
      <div className="w-full h-48">
        <MoleculeWater />
      </div>
    </div>
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-2">Methane (CH₄)</h3>
      <div className="w-full h-48">
        <MoleculeMethane />
      </div>
    </div>
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-2">Ammonia (NH₃)</h3>
      <div className="w-full h-48">
        <MoleculeAmmonia />
      </div>
    </div>
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-2">Oxygen (O₂)</h3>
      <div className="w-full h-48">
        <MoleculeOxygen />
      </div>
    </div>
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-2">Carbon Dioxide (CO₂)</h3>
      <div className="w-full h-48">
        <MoleculeCarbonDioxide />
      </div>
    </div>
  </div>
)
