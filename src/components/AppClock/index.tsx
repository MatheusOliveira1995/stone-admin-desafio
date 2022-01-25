import React, { useEffect, useState } from "react";

export default function AppClock() {
    const [time, setTime] = useState(new Date())

    /**
     */
    const tick = () => {
        setTime(new Date())
    }

    useEffect(() => {
        let timer = setInterval(() => tick(), 1000)
        return () => {
            clearInterval(timer)
          };
    }, [])

    return (
        <div>
            {time.toLocaleTimeString()}
        </div>
    )
}