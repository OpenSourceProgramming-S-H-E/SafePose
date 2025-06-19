package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@RestController
@RequestMapping("/fall")
public class FallController { // ← 클래스 선언 시작

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    @GetMapping("/stream")
    public SseEmitter streamFallAlert() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((Throwable e) -> emitters.remove(emitter));
        return emitter;
    }

    @PostMapping
    public ResponseEntity<String> receiveFallAlert(@RequestBody FallAlertRequest request) {
        String status = request.getStatus();
        System.out.println("낙상 상태: " + status);

        String alertMessage = null;
        switch (status) {
            case "Fall":
                alertMessage = "🚨 환자가 낙상하였습니다. 즉시 병실로 이동해주세요.";
                break;
            case "Suspicious":
                alertMessage = "⚠️ 환자의 낙상 위험이 감지되었습니다. 병실로 이동해주세요.";
                break;
            default:
                System.out.println("[✔️ 정상] 문제 없음.");
                break;
        }

        if (alertMessage != null) {
            String data = "{\"status\":\"" + status + "\", \"message\":\"" + alertMessage + "\"}";
            for (SseEmitter emitter : emitters) {
                try {
                    emitter.send(data);
                } catch (IOException e) {
                    emitters.remove(emitter);
                    System.out.println("SSE 알림 전송 실패: " + e.getMessage());
                }
            }
            System.out.println("[알림] " + alertMessage);
            return ResponseEntity.ok(alertMessage);
        } else {
            return ResponseEntity.ok().build();
        }
    }
}
