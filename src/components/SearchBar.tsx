import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from './Input'
import { Button } from './Button'

export function SearchBar({ initialQuery = '' }: { initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery)
  const navigate = useNavigate()

  const trimmed = useMemo(() => q.trim(), [q])

  return (
    <form
      className="flex w-full items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        navigate(`/search?q=${encodeURIComponent(trimmed)}`)
      }}
    >
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search algorithms, formulas, proofs…" />
      <Button type="submit" variant="primary">
        Search
      </Button>
    </form>
  )
}

