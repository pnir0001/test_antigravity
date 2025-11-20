import { useState } from 'react'
import './App.css'
import { MemoForm } from './components/MemoForm'
import { MemoList } from './components/MemoList'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedMemo, setSelectedMemo] = useState<any>(null)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    setSelectedMemo(null)
  }

  const handleSelectMemo = (memo: any) => {
    setSelectedMemo(memo)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Memo App</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div>
          <MemoList
            refreshKey={refreshKey}
            onDelete={handleRefresh}
            onSelectMemo={handleSelectMemo}
            selectedMemoId={selectedMemo?.id}
          />
        </div>
        <div>
          <MemoForm
            onSuccess={handleRefresh}
            selectedMemo={selectedMemo}
            onClearSelection={() => setSelectedMemo(null)}
          />
        </div>
      </div>
    </div>
  )
}

export default App

