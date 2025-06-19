package com.example.demo.controller;

public class FallAlertRequest {
    private String status;
    // (필요시 이미지 등 추가 가능)
    // private String image;

    // 기본 생성자 (반드시 필요!)
    public FallAlertRequest() {}

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // (필요시 이미지 등 추가 getter/setter)
    // public String getImage() { return image; }
    // public void setImage(String image) { this.image = image; }
}
