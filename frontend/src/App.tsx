import { useState } from "react";
import "./App.css";
import { MemoForm } from "./components/MemoForm";
import { MemoList } from "./components/MemoList";
import type { Memo } from "./api/api";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    setSelectedMemo(null);
  };

  const handleSelectMemo = (memo: Memo) => {
    setSelectedMemo(memo);
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem",
        height: "100vh",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.5)",
            padding: "0.5rem",
            borderRadius: "12px",
            backdropFilter: "blur(4px)",
          }}
        >
          📝
        </div>
        <h1 style={{ fontSize: "2rem", color: "#2d3436" }}>Glass Memo</h1>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "350px 1fr",
          gap: "2rem",
          flex: 1,
          minHeight: 0, // Important for nested scrolling
        }}
      >
        <div style={{ overflowY: "auto", paddingRight: "1rem" }}>
          <MemoList
            refreshKey={refreshKey}
            onDelete={handleRefresh}
            onSelectMemo={handleSelectMemo}
            selectedMemoId={selectedMemo?.id}
          />
        </div>
        <div style={{ height: "100%" }}>
          <MemoForm
            onSuccess={handleRefresh}
            selectedMemo={selectedMemo}
            onClearSelection={() => setSelectedMemo(null)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
