import { useState } from "react";

export default function useForceUpdate() {
    const [v, setV] = useState(0)
    function forceUpdate() {
        setV(v + 1)
    }
    return forceUpdate
}