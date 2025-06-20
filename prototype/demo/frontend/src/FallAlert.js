import React, { useEffect, useState } from 'react';

const alertConfig = {
    Fall: {
        color: "#ff4d4f",
        icon: "🚨",
        message: "환자가 낙상하였습니다.\n즉시 병실로 이동해주십시오.",
    },
    Suspicious: {
        color: "#ffec3d",
        icon: "⚠️",
        message: "환자의 낙상 위험이 감지되었습니다.\n병실로 이동해주십시오.",
    }
};

function FallAlert() {
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        const eventSource = new EventSource("http://localhost:8080/fall/stream");
        eventSource.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setAlert(data.status === "Normal" ? null : data.status);
        };
        eventSource.onerror = (e) => {
            eventSource.close();
        };
        return () => eventSource.close();
    }, []);

    const handleClose = () => setAlert(null);

    return (
        <div style={{
            maxWidth: 480,
            margin: "48px auto",
            border: "1.5px solid #d9d9d9",
            borderRadius: 12,
            boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
            background: "#fff"
        }}>
            <div style={{
                background: "#f5f7fa",
                padding: "18px 28px",
                borderRadius: "12px 12px 0 0",
                borderBottom: "1px solid #e6e6e6",
                fontWeight: 700,
                fontSize: "1.22rem",
                color: "#222",
                letterSpacing: "0.01em"
            }}>
                낙상 알림 시스템
            </div>
            <div style={{ padding: 30, minHeight: 120 }}>
                {alert && alertConfig[alert] && (
                    <div style={{
                        background: alertConfig[alert].color,
                        borderRadius: 10,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        display: "flex",
                        alignItems: "center",
                        padding: "18px 22px",
                        color: alert === "Fall" ? "#fff" : "#222",
                        fontWeight: 500,
                        fontSize: "1.08rem",
                        position: "relative",
                        marginBottom: 10,
                        border: "1px solid #e0e0e0"
                    }}>
                        <span style={{ fontSize: 32, marginRight: 18, flexShrink: 0 }}>
                            {alertConfig[alert].icon}
                        </span>
                        <span style={{
                            whiteSpace: "pre-line",
                            flex: 1,
                            lineHeight: 1.6,
                            letterSpacing: "0.01em"
                        }}>
                            {alertConfig[alert].message}
                        </span>
                        <button
                            onClick={handleClose}
                            style={{
                                background: "none",
                                border: "none",
                                fontSize: 28,
                                fontWeight: "bold",
                                color: alert === "Fall" ? "#fff" : "#222",
                                cursor: "pointer",
                                marginLeft: 18,
                                padding: 0,
                                lineHeight: 1
                            }}
                            aria-label="닫기"
                        >×</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FallAlert;
