import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import logo from "./logo-remove.png";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function Home() {
  const [tableName, setTableName] = useState("");
  const [symbols, setSymbols] = useState([]); // Array of string simbol
  const [showGridOnPage, setShowGridOnPage] = useState(false);

  // Ref untuk container grid di halaman
  const gridRef = useRef(null);

  useEffect(() => {
  if (!showGridOnPage) return;

  const container = gridRef.current;
  if (!container) return;

  container.innerHTML = "";
  container.className = "grid";

  // Load script tradingview jika belum ada
  if (!window.TradingView) {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      renderWidgets();
    };
    document.body.appendChild(script);
  } else {
    renderWidgets();
  }

  // function renderWidgets() {
  //   // Tidak menambah prefix, gunakan simbol apa adanya
  //   const fixedSymbols = symbols.map(sym => sym.trim());

  //   fixedSymbols.forEach((symbol, i) => {
  //     const div = document.createElement("div");
  //     div.id = `tvchart-inpage-${i}`;
  //     div.className = "tvchart";
  //     container.appendChild(div);

  //     new window.TradingView.widget({
  //       container_id: div.id,
  //       width: "100%",
  //       height: "100%",
  //       symbol,
  //       interval: "3M",
  //       timezone: "Asia/Jakarta",
  //       theme: "dark",
  //       style: "1",
  //       locale: "id",
  //       toolbar_bg: "#181a20",
  //       hide_top_toolbar: true,
  //       hide_side_toolbar: true,
  //       allow_symbol_change: false,
  //       details: false,
  //       studies: ["MASimple@tv-basicstudies"],
  //     });
  //   });
  // }
function renderWidgets() {
  symbols.forEach((sym, i) => {
    const container = document.createElement("div");
    container.id = `tvchart-inpage-${i}`;
    container.className = "tvchart";
    gridRef.current.appendChild(container);

    if (sym.includes(":")) {
      // Jika sudah ada prefix exchange, render sekali
      new window.TradingView.widget({
        container_id: container.id,
        width: "100%",
        height: "100%",
        symbol: sym.trim(),
        interval: "3M",
        timezone: "Asia/Jakarta",
        theme: "dark",
        style: "1",
        locale: "id",
        toolbar_bg: "#181a20",
        hide_top_toolbar: true,
        hide_side_toolbar: true,
        allow_symbol_change: false,
        details: false,
        studies: ["MASimple@tv-basicstudies"],
      });
    } else {
      // Jika tidak ada prefix, buat container untuk 2 widget: BINANCE dan TETHER
      // Container utama untuk 2 chart
      const containerWrapper = document.createElement("div");
      containerWrapper.style.display = "flex";
      containerWrapper.style.gap = "8px";
      containerWrapper.style.height = "100%";
      containerWrapper.style.width = "100%";

      // Container untuk BINANCE
      const divBinance = document.createElement("div");
      divBinance.id = `${container.id}-binance`;
      divBinance.style.flex = "1";
      divBinance.style.borderRadius = "8px";
      divBinance.style.overflow = "hidden";
      containerWrapper.appendChild(divBinance);

      // Container untuk TETHER
      const divTether = document.createElement("div");
      divTether.id = `${container.id}-tether`;
      divTether.style.flex = "1";
      divTether.style.borderRadius = "8px";
      divTether.style.overflow = "hidden";
      containerWrapper.appendChild(divTether);

      // Ganti container utama jadi wrapper yang berisi dua widget
      gridRef.current.appendChild(containerWrapper);

      // Buat widget BINANCE
      new window.TradingView.widget({
        container_id: divBinance.id,
        width: "100%",
        height: "100%",
        symbol: `BINANCE:${sym.trim()}`,
        interval: "3M",
        timezone: "Asia/Jakarta",
        theme: "dark",
        style: "1",
        locale: "id",
        toolbar_bg: "#181a20",
        hide_top_toolbar: true,
        hide_side_toolbar: true,
        allow_symbol_change: false,
        details: false,
        studies: ["MASimple@tv-basicstudies"],
      });

      // Buat widget TETHER sebagai fallback
      new window.TradingView.widget({
        container_id: divTether.id,
        width: "100%",
        height: "100%",
        symbol: `TETHER:${sym.trim()}`,
        interval: "3M",
        timezone: "Asia/Jakarta",
        theme: "dark",
        style: "1",
        locale: "id",
        toolbar_bg: "#181a20",
        hide_top_toolbar: true,
        hide_side_toolbar: true,
        allow_symbol_change: false,
        details: false,
        studies: ["MASimple@tv-basicstudies"],
      });
    }
  });
}

//   function renderWidgets() {
//   const fixedSymbols = symbols.map(sym => {
//     // Jika sudah ada prefix exchange, gunakan apa adanya
//     if (sym.includes(":")) {
//       return sym.trim();
//     }
//     // Jika tidak ada prefix, tambahkan BINANCE:
//     return `BINANCE:${sym.trim()}`;
//   });

//   fixedSymbols.forEach((symbol, i) => {
//     const div = document.createElement("div");
//     div.id = `tvchart-inpage-${i}`;
//     div.className = "tvchart";
//     container.appendChild(div);

//     new window.TradingView.widget({
//       container_id: div.id,
//       width: "100%",
//       height: "100%",
//       symbol,
//       interval: "3M",
//       timezone: "Asia/Jakarta",
//       theme: "dark",
//       style: "1",
//       locale: "id",
//       toolbar_bg: "#181a20",
//       hide_top_toolbar: true,
//       hide_side_toolbar: true,
//       allow_symbol_change: false,
//       details: false,
//       studies: ["MASimple@tv-basicstudies"],
//     });
//   });
// }


  // Cleanup: hapus container konten saat komponen unmount atau sebelum render ulang
  return () => {
    if (container) {
      container.innerHTML = "";
    }
  };
}, [symbols, showGridOnPage]);



  // Parsing simbol dari input Table Name (pisah koma/spasi)
  const parseSymbolsFromTableName = (name) => {
    return name
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  // Handle upload file excel, gabungkan kolom Exchange dan Saham jadi simbol "Exchange:Saham"
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      const syms = jsonData.map((row) => {
        if (row["Exchange"] && row["Saham"]) {
          return `${row["Exchange"].trim()}:${row["Saham"].trim()}`;
        }
        const firstKey = Object.keys(row)[0];
        return (row[firstKey] || "").trim();
      }).filter(val => val.length > 0);

      setSymbols(syms);
      setShowGridOnPage(false); // reset tampilan halaman
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle input Table Name berubah => update symbols
  const handleTableNameChange = (e) => {
  let val = e.target.value;

  // Hilangkan tanda kutip " dan '
  val = val.replace(/['"]/g, "");

  setTableName(val);

  // Parsing simbol (pisahkan koma/spasi), sudah bersih dari tanda kutip
  let parsedSymbols = parseSymbolsFromTableName(val);

  // Tambahkan prefix default jika belum ada prefix (optional, bisa dihilangkan jika tidak ingin)
  parsedSymbols = parsedSymbols.map(sym => sym.includes(":") ? sym : `BINANCE:${sym}`);

  setSymbols(parsedSymbols);
  setShowGridOnPage(false);
};


  // Fungsi buka tab baru TradingView (tetap dipertahankan)
  const openTradingViewTabs = () => {
    if (symbols.length === 0) {
      MySwal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Masukkan simbol melalui Table Name atau upload Excel",
        confirmButtonColor: "#0c3320",
      });
      return;
    }

    const invalidSymbols = symbols.filter(sym => !sym.includes(":"));
    if (invalidSymbols.length > 0) {
      MySwal.fire({
        icon: "info",
        title: "Format Simbol",
        html: (
          <>
            Ada simbol tanpa <b>exchange:</b> (misal: <b>{invalidSymbols.join(", ")}</b>)<br />
            Sistem akan menambahkan prefix default "BINANCE:" supaya valid.
          </>
        ),
        confirmButtonColor: "#0c3320",
      });
    }

    const chunkSize = 40;
    for (let i = 0; i < symbols.length; i += chunkSize) {
      const chunk = symbols.slice(i, i + chunkSize);
      // const fixedSymbols = chunk.map(sym => (!sym.includes(":") ? "BINANCE:" + sym : sym));
      const fixedSymbols = chunk.map(sym => {
  if (sym.includes(":")) {
    return sym.trim();
  }
  return `BINANCE:${sym.trim()}`;
});

      const gridItems = chunk.map((_, idx) => `<div id="tvchart${idx}" class="tvchart"></div>`).join("");

      const widgetScript = `
        const symbols = ${JSON.stringify(fixedSymbols)};
        symbols.forEach((symbol, i) => {
          new TradingView.widget({
            container_id: 'tvchart' + i,
            width: '100%',
            height: '100%',
            symbol: symbol,
            interval: "3M",
            timezone: "Asia/Jakarta",
            theme: "dark",
            style: "1",
            locale: "id",
            toolbar_bg: "#181a20",
            hide_top_toolbar: true,
            hide_side_toolbar: true,
            allow_symbol_change: false,
            details: false,
            studies: ["MASimple@tv-basicstudies"]
          });
        });
      `;

      const newTab = window.open();
      newTab.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>TradingView Grid</title>
          <style>
            body { background: #181a20; margin: 0; }
            .grid {
              display: grid;
              grid-template-columns: repeat(5, 1fr);
              gap: 16px;
              padding: 16px;
            }
            .tvchart {
              height: 300px;
              min-width: 300px;
              background: #20232a;
              border-radius: 8px;
              overflow: hidden;
            }
            h2 { color: #fff; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          <h2 style="padding-left:16px">TradingView Symbols (Batch ${(i / chunkSize) + 1})</h2>
          <div class="grid" id="tvgrid">${gridItems}</div>
          <script src="https://s3.tradingview.com/tv.js"></script>
          <script>${widgetScript}</script>
        </body>
        </html>
      `);
      newTab.document.close();
    }
  };

  // Fungsi render TradingView grid di halaman yang sama
  const renderTradingViewGrid = () => {
    if (!showGridOnPage) return null;

    return (
      <div>
        <h2 style={{ color: "white", paddingLeft: 16 }}>TradingView Symbols (Grid View)</h2>
        <div ref={gridRef} style={{ minHeight: 300, padding: 16 }} />
      </div>
    );
  };

  // Tombol untuk toggle tampil di halaman
  const toggleShowGridOnPage = () => {
    setShowGridOnPage((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    openTradingViewTabs();
  };

  return (
  <div style={{ backgroundColor: "#0D1B27", minHeight: "100vh", padding: 20, fontFamily: "Arial, sans-serif", color: "white" }}>
    <div style={{ textAlign: "center", marginBottom: 20 }}>
      <img src={logo} alt="Logo" style={{ maxWidth: "400px", height: "auto" }} />
    </div>

    <p style={{ textAlign: "center", marginBottom: 30 }}>
      Enter Exchange and Stock Symbols for TradingView display
    </p>

    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 15 }}>
      <input
        type="text"
        placeholder="Exchange:Stock (separate symbols by comma or space)"
        value={tableName}
        onChange={handleTableNameChange}
        style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc", backgroundColor: "#c7c8c6", fontSize: 16, color: "black" }}
      />

      <label
        htmlFor="uploadExcel"
        style={{ backgroundColor: "#c7c8c6", height: 80, borderRadius: 6, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 18, color: "#555", cursor: "pointer", userSelect: "none" }}
      >
        Click or drag Excel file here to upload
      </label>
      <input id="uploadExcel" type="file" accept=".xlsx, .xls" onChange={handleFileUpload} style={{ display: "none" }} />

      <a
        href="/market.xlsx"
        download
        style={{ display: "inline-block", backgroundColor: "#005f73", color: "white", textAlign: "center", padding: "10px", borderRadius: 6, textDecoration: "none", fontWeight: "bold", cursor: "pointer" }}
      >
        Download Sample Excel File
      </a>

      <button
        type="submit"
        style={{ backgroundColor: "#0c3320", color: "white", border: "none", padding: 12, borderRadius: 6, fontSize: 16, cursor: "pointer" }}
        disabled={symbols.length === 0}
      >
        Create (Open New Tab)
      </button>

      {/* <button
        type="button"
        onClick={toggleShowGridOnPage}
        style={{ backgroundColor: "#006d75", color: "white", border: "none", padding: 12, borderRadius: 6, fontSize: 16, cursor: "pointer" }}
        disabled={symbols.length === 0}
      >
        {showGridOnPage ? "Hide Grid on This Page" : "Show Grid on This Page"}
      </button> */}
    </form>

    {/* Preview symbols */}
    {symbols.length > 0 && (
      <div style={{ marginTop: 20, maxWidth: 400, marginLeft: "auto", marginRight: "auto", color: "white", backgroundColor: "#1f2a3c", padding: 10, borderRadius: 6, fontSize: 12, whiteSpace: "pre-wrap" }}>
        <h3>Symbols to be displayed:</h3>
        {symbols.join(", ")}
        <br />
        <i>(Total symbols: {symbols.length})</i>
      </div>
    )}

    {/* Render TradingView Grid on page */}
    {showGridOnPage && (
      <div>
        <h2 style={{ color: "white", paddingLeft: 16 }}>TradingView Symbols (Grid View)</h2>
        <div ref={gridRef} style={{ minHeight: 300, padding: 16 }} />
      </div>
    )}
  </div>
);

}

export default Home;
