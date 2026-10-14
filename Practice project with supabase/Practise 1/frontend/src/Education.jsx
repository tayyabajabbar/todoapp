import { useState } from "react";

function Education({ education, fetchEducation, authHeaders, setError, apiUrl }) {
  const [degree, setDegree] = useState("");
  const [institution, setInstitution] = useState("");
  const [year, setYear] = useState("");

  const [editId, setEditId] = useState(null);
  const [editDegree, setEditDegree] = useState("");
  const [editInstitution, setEditInstitution] = useState("");
  const [editYear, setEditYear] = useState("");

  // CREATE - Add a new education entry
  const addEducation = async (e) => {
    e.preventDefault();

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ degree, institution, year }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    setError("");
    setDegree("");
    setInstitution("");
    setYear("");
    fetchEducation();
  };

  // Start editing an entry
  const startEdit = (item) => {
    setEditId(item.id);
    setEditDegree(item.degree);
    setEditInstitution(item.institution || "");
    setEditYear(item.year || "");
  };

  // UPDATE - Save edited entry
  const saveEdit = async (id) => {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({
        degree: editDegree,
        institution: editInstitution,
        year: editYear,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    setError("");
    setEditId(null);
    setEditDegree("");
    setEditInstitution("");
    setEditYear("");
    fetchEducation();
  };

  // DELETE - Remove an entry
  const deleteEducation = async (id) => {
    await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    fetchEducation();
  };

  return (
    <>
      <form className="stacked" onSubmit={addEducation}>
        <input
          type="text"
          placeholder="Degree / Certificate (e.g. BSCS, Matric)..."
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
        />
        <input
          type="text"
          placeholder="Institute / School (e.g. Punjab University)..."
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
        />
        <input
          type="text"
          placeholder="Passing Year / Duration (e.g. 2020 - 2024)..."
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Add Education
        </button>
      </form>

      {education.length === 0 ? (
        <div className="empty">
          <p>No education records yet</p>
          <p className="empty-sub">Add your first qualification above</p>
        </div>
      ) : (
        <ul className="education-list">
          {education.map((item) => (
            <li key={item.id} className={editId === item.id ? "note-editing" : ""}>
              {editId === item.id ? (
                <>
                  <input
                    type="text"
                    value={editDegree}
                    placeholder="Degree / Certificate"
                    onChange={(e) => setEditDegree(e.target.value)}
                  />
                  <input
                    type="text"
                    value={editInstitution}
                    placeholder="Institute / School"
                    onChange={(e) => setEditInstitution(e.target.value)}
                  />
                  <input
                    type="text"
                    value={editYear}
                    placeholder="Year / Duration"
                    onChange={(e) => setEditYear(e.target.value)}
                  />
                  <div className="row-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => saveEdit(item.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setEditId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="note-main">
                    <strong>{item.degree}</strong>
                    {item.institution && (
                      <p className="edu-institute">🏫 {item.institution}</p>
                    )}
                    {item.year && (
                      <p className="edu-year">📅 {item.year}</p>
                    )}
                  </div>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => startEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteEducation(item.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default Education;
