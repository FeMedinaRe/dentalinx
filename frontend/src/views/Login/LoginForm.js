import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

const LoginForm = () => {
  const [rut, setRut] = useState("");
  const [error, setError] = useState("");

  const handleRutChange = (event) => {
    setRut(event.target.value);
  };

  const validateRut = (rut) => {
    // Verificar si el RUT es igual a "200000"
    return rut === "200000";
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (!validateRut(rut)) {
      setError("RUT incorrecto");
      return;
    }

    setError(""); // Limpia el mensaje de error antes de la redirección

    return <Redirect to="/dashboard" />;
    // Redirige después de validar y ejecutar handleSubmit
  };

  useEffect(() => {
    const cookies = new Cookies();
    const idCookie = cookies.get("rut");

    if (!idCookie) {
      window.history.pushState(null, "", "/");
    } else if (idCookie && window.location.pathname === "/") {
      window.history.pushState(null, "", "/dashboard");
    }
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Iniciar sesión - Clínica Dental</h2>
      <form onSubmit={handleSubmitForm} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="rut" style={styles.label}>
            RUT:
          </label>
          <input
            type="text"
            id="rut"
            value={rut}
            onChange={handleRutChange}
            style={styles.input}
            required
          />
        </div>
        <button type="submit" style={styles.button}>
          Iniciar sesión
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  logo: {
    width: "80px",
    height: "80px",
    marginBottom: "16px",
  },
  title: {
    fontSize: "24px",
    marginBottom: "16px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "300px",
  },
  inputGroup: {
    marginBottom: "12px",
  },
  label: {
    marginBottom: "4px",
  },
  input: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "100%",
  },
  button: {
    padding: "8px 16px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "16px",
    marginTop: "8px",
    textAlign: "center",
  },
};

export default LoginForm;
