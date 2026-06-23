"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Lock } from "lucide-react"

export function MockPaymentForm() {
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [name, setName] = useState("")

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ")
  }

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4)
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2)
    return digits
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <CreditCard className="h-4 w-4" />
        <span>Mock Payment (demo only)</span>
        <span className="ml-auto flex items-center gap-1 text-xs">
          <Lock className="h-3 w-3" /> Secured
        </span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardName">Cardholder Name</Label>
        <Input
          id="cardName"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          placeholder="4242 4242 4242 4242"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          maxLength={19}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry">Expiry Date</Label>
          <Input
            id="expiry"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            maxLength={5}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvc">CVC</Label>
          <Input
            id="cvc"
            placeholder="123"
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
            maxLength={3}
          />
        </div>
      </div>
    </div>
  )
}
