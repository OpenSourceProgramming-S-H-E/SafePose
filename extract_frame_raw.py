import cv2
import os

# 1. 로컬 기본 경로 설정
base_path = r'E:\OpensourceProject\FallDetection'

# 2. Fall / Suspicious / Normal 세 폴더 순회
labels = ['Fall', 'Suspicious', 'Normal']

for label in labels:
    input_folder = os.path.join(base_path, label)
    output_folder = os.path.join(base_path, 'frames', label)  # 결과 저장 폴더
    os.makedirs(output_folder, exist_ok=True)

    for filename in os.listdir(input_folder):
        if not filename.lower().endswith('.mp4'):
            continue

        video_path = os.path.join(input_folder, filename)
        name = os.path.splitext(filename)[0]
        frame_out_dir = os.path.join(output_folder, name)
        os.makedirs(frame_out_dir, exist_ok=True)

        vid = cv2.VideoCapture(video_path)
        frame_count = 0
        while True:
            success, frame = vid.read()
            if not success:
                break
            frame_filename = os.path.join(frame_out_dir, f'{frame_count:04d}.jpg')
            cv2.imwrite(frame_filename, frame)
            frame_count += 1

        vid.release()
        print(f"✅ {label} - {filename}: {frame_count}장 추출 완료")
