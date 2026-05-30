import { useEffect, useState } from "react";

const sampleAssets = [
  {
    id: 1,
    name: "POS-101",
    type: "POS Terminal",
    status: "Active",
    location: "LGA Terminal B",
  },
  {
    id: 2,
    name: "SW-202",
    type: "Network Switch",
    status: "Offline",
    location: "Server Room",
  },
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
          asset.id === editingId
            ? { ...asset, ...formData }
            : asset
        )
      );

      setEditingId(null);
    } else {
      setAssets([
        ...assets,
        {
          id: Date.now(),
          ...formData,
        },
      ]);
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
    const confirmDelete = window.confirm(
      "Delete this asset?"
    );

    if (confirmDelete) {
      setAssets(
        assets.filter((asset) => asset.id !== id)
      );
    }
  };

  const filteredAssets = assets.filter((asset) =>
    Object.values(asset)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalAssets = assets.length;

  const activeAssets = assets.filter(
    (asset) => asset.status === "Active"
  ).length;

  const offlineAssets = assets.filter(
    (asset) => asset.status === "Offline"
  ).length;

  return (
    <div className="bg-light min-vh-100">

      <nav className="navbar navbar-dark shadow-sm" style={{ backgroundColor: "#38bdf8" }}>
        <div className="container">
          <span className="navbar-brand mb-0 h1">
            Enterprise IT Asset Manager
          </span>
        </div>
      </nav>

      <div className="container py-4">

        <div className="row g-4 mb-4">

          <div className="col-md-4">
            <div className="card shadow border-0">
              <div className="card-body">
                <h6 className="text-muted">
                  Total Assets
                </h6>
                <h2>{totalAssets}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow border-0">
              <div className="card-body">
                <h6 className="text-muted">
                  Active Devices
                </h6>
                <h2 className="text-success">
                  {activeAssets}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow border-0">
              <div className="card-body">
                <h6 className="text-muted">
                  Offline Devices
                </h6>
                <h2 className="text-danger">
                  {offlineAssets}
                </h2>
              </div>
            </div>
          </div>

        </div>

        <div className="card shadow border-0 mb-4">

          <div className="card-body">

            <h4 className="mb-4">
              {editingId
                ? "Edit Asset"
                : "Add New Asset"}
            </h4>

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

              <button className="btn btn-dark mt-3">
                {editingId
                  ? "Update Asset"
                  : "Add Asset"}
              </button>

            </form>

          </div>

        </div>

        <div className="card shadow border-0">

          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center mb-4">

              <h4 className="mb-0">
                Asset Inventory
              </h4>

              <input
                type="text"
                className="form-control w-50"
                placeholder="Search assets..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <div className="table-responsive">

              <table className="table align-middle">

                <thead style={{ backgroundColor: "#fdba74", color: "#111827" }}>
                  <tr style={{ backgroundColor: "#fdba74", color: "#111827" }}>
                    <th>Device</th>
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

                      <td>

                        <span
                          className={
                            asset.status === "Active"
                              ? "badge bg-success"
                              : "badge bg-danger"
                          }
                        >
                          {asset.status}
                        </span>

                      </td>

                      <td>{asset.location}</td>

                      <td>

                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() =>
                            editAsset(asset)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            deleteAsset(asset.id)
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

      <footer className="text-light text-center py-3 mt-5" style={{ backgroundColor: "#38bdf8" }}>
        Enterprise IT Asset Manager © 2026
      </footer>

    </div>
  );
}

export default App;
