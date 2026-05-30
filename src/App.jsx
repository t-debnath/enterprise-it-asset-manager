import { useEffect, useState } from "react";

const sampleAssets = [
  { id: 1, name: "POS-101", type: "POS Terminal", status: "Active", location: "LGA Terminal B" },
  { id: 2, name: "SW-202", type: "Network Switch", status: "Offline", location: "Server Room" },
];

function App() {
  const [assets, setAssets] = useState(() => {
    const savedAssets = localStorage.getItem("assets");
    return savedAssets ? JSON.parse(savedAssets) : sampleAssets;
  });

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "Active",
    location: "",
  });

  useEffect(() => {
    localStorage.setItem("assets", JSON.stringify(assets));
  }, [assets]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveAsset = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.type || !formData.location) {
      alert("Please fill all fields");
      return;
    }

    if (editingId) {
      setAssets(
        assets.map((asset) =>
          asset.id === editingId ? { ...asset, ...formData } : asset
        )
      );
      setEditingId(null);
    } else {
      setAssets([...assets, { id: Date.now(), ...formData }]);
    }

    setFormData({
      name: "",
      type: "",
      status: "Active",
      location: "",
    });
  };

  const editAsset = (asset) => {
    setEditingId(asset.id);
    setFormData({
      name: asset.name,
      type: asset.type,
      status: asset.status,
      location: asset.location,
    });
  };

  const deleteAsset = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this asset?");
    if (confirmDelete) {
      setAssets(assets.filter((asset) => asset.id !== id));
    }
  };

  const filteredAssets = assets.filter((asset) =>
    Object.values(asset).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const totalAssets = assets.length;
  const activeAssets = assets.filter((asset) => asset.status === "Active").length;
  const offlineAssets = assets.filter((asset) => asset.status === "Offline").length;

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Enterprise IT Asset Manager</h1>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Total Assets</h5>
              <h2>{totalAssets}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Active Devices</h5>
              <h2>{activeAssets}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Offline Devices</h5>
              <h2>{offlineAssets}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="mb-3">{editingId ? "Edit Asset" : "Add New Asset"}</h4>

          <form onSubmit={saveAsset}>
            <div className="row g-3">
              <div className="col-md-3">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Device Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3">
                <input
                  type="text"
                  name="type"
                  className="form-control"
                  placeholder="Device Type"
                  value={formData.type}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3">
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option>Active</option>
                  <option>Offline</option>
                </select>
              </div>

              <div className="col-md-3">
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button className="btn btn-primary mt-3">
              {editingId ? "Update Asset" : "Add Asset"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary mt-3 ms-2"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    name: "",
                    type: "",
                    status: "Active",
                    location: "",
                  });
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Asset Inventory</h4>

            <input
              type="text"
              className="form-control w-50"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <table className="table table-striped">
            <thead>
              <tr>
                <th>Device Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.id}>
                  <td>{asset.name}</td>
                  <td>{asset.type}</td>
                  <td>{asset.status}</td>
                  <td>{asset.location}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => editAsset(asset)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteAsset(asset.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAssets.length === 0 && (
            <p className="text-center text-muted">No assets found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
