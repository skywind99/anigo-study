import React from "react";
import { Seat, Reservation } from "../App";

interface SeatGridProps {
  seats: Seat[];
  reservations: Reservation[];
  currentDate: string;
  grade: number;
  onSeatClick?: (seatId: string) => void;
  selectedSeat?: string;
  mode: "view" | "select";
}

const SeatGrid: React.FC<SeatGridProps> = ({
  seats,
  reservations,
  currentDate,
  grade,
  onSeatClick,
  selectedSeat,
  mode,
}) => {
  const isMobile = window.innerWidth < 768;

  const isSeatAvailable = (seatId: string) => {
    // 예약 상태이거나 입실완료 상태이면 사용 불가능 (선택 모드일 때)
    return !reservations.find(
      (r) =>
        r.seat_id === seatId &&
        r.date === currentDate &&
        r.status !== "퇴실완료" // 퇴실 완료된 좌석은 다시 선택 가능하다고 가정
    );
  };

  const getSeatStatus = (seatId: string) => {
    const reservation = reservations.find(
      (r) => r.seat_id === seatId && r.date === currentDate
    );
    return reservation?.status || "empty";
  };

  const getSeatColor = (seatId: string) => {
    if (mode === "select") {
      if (selectedSeat === seatId) return "#3B82F6";
      return isSeatAvailable(seatId) ? "white" : "#E5E7EB";
    }

    const status = getSeatStatus(seatId);
    switch (status) {
      case "입실완료":
        return "#10B981";
      case "예약":
        return "#F59E0B";
      case "미입실":
        return "#EF4444";
      default:
        return "white";
    }
  };

  const getSeatNumber = (seatId: string) => {
    const seat = seats.find((s) => s.id === seatId);
    // seatId가 'A-1' 형태일 때 number만 반환
    return seat?.number.toString() || seatId.split("-")[1] || "";
  };

  const getSeatStyle = (seatId: string, isClickable: boolean) => {
    const baseStyle: React.CSSProperties = {
      width: "100%",
      aspectRatio: "1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: selectedSeat === seatId ? "3px solid #3B82F6" : "2px solid #ddd",
      borderRadius: "8px",
      background: getSeatColor(seatId),
      color: mode === "select" && selectedSeat === seatId ? "white" : "#1F2937",
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "bold",
      cursor: isClickable ? "pointer" : "not-allowed",
      transition: "all 0.2s",
      opacity: isClickable ? 1 : 0.3,
    };
    return baseStyle;
  };

  const emptyStyle: React.CSSProperties = {
    width: "100%",
    aspectRatio: "1",
    visibility: "hidden",
  };

  // ✅ A구역: 3학년석 (왼쪽 1열 7개 + 오른쪽 3×2 테이블 4개)
  const renderGroupA = () => {
    // 3학년이 아니면 렌더링 안함
    if (grade !== 3) return null;

    const groupASeats = seats
      .filter((s) => s.group === "A" && s.grade === 3)
      .sort((a, b) => a.number - b.number);

    return (
      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "15px",
            color: "#3B82F6",
          }}
        >
          A구역 - 3학년석 (31석)
        </h3>

        <div style={{ display: "flex", gap: "20px" }}>
          {/* 왼쪽 1열 (1-7번) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gridTemplateRows: "repeat(7, 1fr)",
              gap: "8px",
              width: "60px",
            }}
          >
            {groupASeats.slice(0, 7).map((seat) => {
              const isClickable = mode === "select" && isSeatAvailable(seat.id);
              return (
                <button
                  key={seat.id}
                  onClick={() => isClickable && onSeatClick?.(seat.id)}
                  style={getSeatStyle(seat.id, isClickable)}
                  disabled={!isClickable}
                >
                  {getSeatNumber(seat.id)}
                </button>
              );
            })}
          </div>

          {/* 오른쪽 3×2 테이블 4개 (8-31번) */}
          <div style={{ flex: 1 }}>
            {/* 상단 2개 테이블 (8-19번) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr) 30px repeat(3, 1fr)",
                gap: "8px",
                marginBottom: "15px",
                maxWidth: "450px",
              }}
            >
              {/* 좌측 테이블 (8-13번) */}
              {groupASeats.slice(7, 13).map((seat) => {
                const isClickable =
                  mode === "select" && isSeatAvailable(seat.id);
                return (
                  <button
                    key={seat.id}
                    onClick={() => isClickable && onSeatClick?.(seat.id)}
                    style={getSeatStyle(seat.id, isClickable)}
                    disabled={!isClickable}
                  >
                    {getSeatNumber(seat.id)}
                  </button>
                );
              })}

              {/* 중간 공간 */}
              <div style={{ gridColumn: "4", gridRow: "1 / 3" }}></div>

              {/* 우측 테이블 (14-19번) */}
              {groupASeats.slice(13, 19).map((seat) => {
                const isClickable =
                  mode === "select" && isSeatAvailable(seat.id);
                return (
                  <button
                    key={seat.id}
                    onClick={() => isClickable && onSeatClick?.(seat.id)}
                    style={getSeatStyle(seat.id, isClickable)}
                    disabled={!isClickable}
                  >
                    {getSeatNumber(seat.id)}
                  </button>
                );
              })}
            </div>

            {/* 하단 2개 테이블 (20-31번) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr) 30px repeat(3, 1fr)",
                gap: "8px",
                maxWidth: "450px",
              }}
            >
              {/* 좌측 테이블 (20-25번) */}
              {groupASeats.slice(19, 25).map((seat) => {
                const isClickable =
                  mode === "select" && isSeatAvailable(seat.id);
                return (
                  <button
                    key={seat.id}
                    onClick={() => isClickable && onSeatClick?.(seat.id)}
                    style={getSeatStyle(seat.id, isClickable)}
                    disabled={!isClickable}
                  >
                    {getSeatNumber(seat.id)}
                  </button>
                );
              })}

              {/* 중간 공간 */}
              <div style={{ gridColumn: "4", gridRow: "1 / 3" }}></div>

              {/* 우측 테이블 (26-31번) */}
              {groupASeats.slice(25, 31).map((seat) => {
                const isClickable =
                  mode === "select" && isSeatAvailable(seat.id);
                return (
                  <button
                    key={seat.id}
                    onClick={() => isClickable && onSeatClick?.(seat.id)}
                    style={getSeatStyle(seat.id, isClickable)}
                    disabled={!isClickable}
                  >
                    {getSeatNumber(seat.id)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // B구역: 2학년 폐쇄형 (10열 × 4행, 마지막 줄 39번까지)
  const renderGroupB = () => {
    // 2학년이 아니면 렌더링 안함
    if (grade !== 2) return null;

    const groupBSeats = seats
      .filter((s) => s.group === "B" && s.grade === 2)
      .sort((a, b) => a.number - b.number);

    return (
      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "15px",
            color: "#10B981",
          }}
        >
          B구역 - 2학년 폐쇄형 (39석){" "}
          {groupBSeats.length > 0 ? `- 현재 ${groupBSeats.length}석` : ""}
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 1fr)",
            gap: "8px",
            maxWidth: "800px",
          }}
        >
          {/* 1-10번 */}
          {groupBSeats.slice(0, 10).map((seat) => {
            const isClickable = mode === "select" && isSeatAvailable(seat.id);
            return (
              <button
                key={seat.id}
                onClick={() => {
                  if (isClickable && onSeatClick) {
                    onSeatClick(seat.id);
                  }
                }}
                style={getSeatStyle(seat.id, isClickable)}
                disabled={!isClickable}
              >
                {getSeatNumber(seat.id)}
              </button>
            );
          })}

          {/* 11-20번 */}
          {groupBSeats.slice(10, 20).map((seat) => {
            const isClickable = mode === "select" && isSeatAvailable(seat.id);
            return (
              <button
                key={seat.id}
                onClick={() => isClickable && onSeatClick?.(seat.id)}
                style={getSeatStyle(seat.id, isClickable)}
                disabled={!isClickable}
              >
                {getSeatNumber(seat.id)}
              </button>
            );
          })}

          {/* 21-30번 */}
          {groupBSeats.slice(20, 30).map((seat) => {
            const isClickable = mode === "select" && isSeatAvailable(seat.id);
            return (
              <button
                key={seat.id}
                onClick={() => isClickable && onSeatClick?.(seat.id)}
                style={getSeatStyle(seat.id, isClickable)}
                disabled={!isClickable}
              >
                {getSeatNumber(seat.id)}
              </button>
            );
          })}

          {/* 31-39번 + 빈 칸 */}
          {groupBSeats.slice(30, 39).map((seat) => {
            const isClickable = mode === "select" && isSeatAvailable(seat.id);
            return (
              <button
                key={seat.id}
                onClick={() => isClickable && onSeatClick?.(seat.id)}
                style={getSeatStyle(seat.id, isClickable)}
                disabled={!isClickable}
              >
                {getSeatNumber(seat.id)}
              </button>
            );
          })}
          {/* 39석이므로 마지막에 빈 칸 1개 (40번 자리) */}
          <div style={emptyStyle}></div>
        </div>
      </div>
    );
  };

  // C구역: 2학년 폐쇄형 (7열 × 4행, 마지막 줄 양쪽 끝 공석)
  const renderGroupC = () => {
    // 2학년이 아니면 렌더링 안함
    if (grade !== 2) return null;

    const groupCSeats = seats
      .filter((s) => s.group === "C" && s.grade === 2)
      .sort((a, b) => a.number - b.number);

    // C구역은 26석을 가정하고, 7*4=28칸 중 2칸이 비도록 구현합니다.

    return (
      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "15px",
            color: "#8B5CF6",
          }}
        >
          C구역 - 2학년 폐쇄형 (26석)
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "8px",
            maxWidth: "600px",
          }}
        >
          {/* 1-7번 */}
          {groupCSeats.slice(0, 7).map((seat) => {
            const isClickable = mode === "select" && isSeatAvailable(seat.id);
            return (
              <button
                key={seat.id}
                onClick={() => isClickable && onSeatClick?.(seat.id)}
                style={getSeatStyle(seat.id, isClickable)}
                disabled={!isClickable}
              >
                {getSeatNumber(seat.id)}
              </button>
            );
          })}

          {/* 8-14번 */}
          {groupCSeats.slice(7, 14).map((seat) => {
            const isClickable = mode === "select" && isSeatAvailable(seat.id);
            return (
              <button
                key={seat.id}
                onClick={() => isClickable && onSeatClick?.(seat.id)}
                style={getSeatStyle(seat.id, isClickable)}
                disabled={!isClickable}
              >
                {getSeatNumber(seat.id)}
              </button>
            );
          })}

          {/* 15-21번 */}
          {groupCSeats.slice(14, 21).map((seat) => {
            const isClickable = mode === "select" && isSeatAvailable(seat.id);
            return (
              <button
                key={seat.id}
                onClick={() => isClickable && onSeatClick?.(seat.id)}
                style={getSeatStyle(seat.id, isClickable)}
                disabled={!isClickable}
              >
                {getSeatNumber(seat.id)}
              </button>
            );
          })}

          {/* 4번째 줄: 빈칸 + 22-26번 + 빈칸 (총 5석만 렌더링) */}
          <div style={emptyStyle}></div>
          {groupCSeats.slice(21, 26).map((seat) => {
            const isClickable = mode === "select" && isSeatAvailable(seat.id);
            return (
              <button
                key={seat.id}
                onClick={() => isClickable && onSeatClick?.(seat.id)}
                style={getSeatStyle(seat.id, isClickable)}
                disabled={!isClickable}
              >
                {getSeatNumber(seat.id)}
              </button>
            );
          })}
          <div style={emptyStyle}></div>
        </div>
      </div>
    );
  };

  // D구역: 2학년 오픈형 (32석)
  const renderGroupD = () => {
    // 2학년이 아니면 렌더링 안함
    if (grade !== 2) return null;

    const groupDSeats = seats
      .filter((s) => s.group === "D" && s.grade === 2)
      .sort((a, b) => a.number - b.number);

    // D구역의 좌석 번호 범위 확인: D-1 ~ D-32 (총 32석)
    // 상단 (D-1 ~ D-18) = 18석
    // 하단 (D-19 ~ D-32) = 14석

    // 상단 배치: 2x2 테이블 3개 | 3x2 테이블 1개 (총 18석)
    // 2x2 테이블 3개: 4*3 = 12석 (D-1 ~ D-12)
    // 3x2 테이블 1개: 6석 (D-13 ~ D-18)

    // 하단 배치: 1x8 줄 1개 | 3x2 테이블 1개 (총 14석)
    // 1x8 줄 1개: 8석 (D-19 ~ D-26)
    // 3x2 테이블 1개: 6석 (D-27 ~ D-32)

    return (
      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "15px",
            color: "#F59E0B",
          }}
        >
          D구역 - 2학년 오픈형 (32석)
        </h3>

        {/* --- 상단 배치 (D-1 ~ D-18): 2x2 테이블 3개 + 3x2 테이블 1개 --- */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "flex-start",
            marginBottom: "15px",
            maxWidth: "700px",
          }}
        >
          {/* 1. 2x2 테이블 3개 (D-1 ~ D-12) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, 1fr) 20px repeat(2, 1fr) 20px repeat(2, 1fr)",
              gap: "8px",
              flex: 1, // 공간을 차지하도록 설정
            }}
          >
            {/* D-1 ~ D-4 (2x2) */}
            {groupDSeats.slice(0, 4).map((seat) => {
              const isClickable = mode === "select" && isSeatAvailable(seat.id);
              return (
                <button
                  key={seat.id}
                  onClick={() => isClickable && onSeatClick?.(seat.id)}
                  style={getSeatStyle(seat.id, isClickable)}
                  disabled={!isClickable}
                >
                  {getSeatNumber(seat.id)}
                </button>
              );
            })}
            <div style={{ gridColumn: "3", gridRow: "1 / 3" }}></div>{" "}
            {/* 간격 */}
            {/* D-5 ~ D-8 (2x2) */}
            {groupDSeats.slice(4, 8).map((seat) => {
              const isClickable = mode === "select" && isSeatAvailable(seat.id);
              return (
                <button
                  key={seat.id}
                  onClick={() => isClickable && onSeatClick?.(seat.id)}
                  style={getSeatStyle(seat.id, isClickable)}
                  disabled={!isClickable}
                >
                  {getSeatNumber(seat.id)}
                </button>
              );
            })}
            <div style={{ gridColumn: "6", gridRow: "1 / 3" }}></div>{" "}
            {/* 간격 */}
            {/* D-9 ~ D-12 (2x2) */}
            {groupDSeats.slice(8, 12).map((seat) => {
              const isClickable = mode === "select" && isSeatAvailable(seat.id);
              return (
                <button
                  key={seat.id}
                  onClick={() => isClickable && onSeatClick?.(seat.id)}
                  style={getSeatStyle(seat.id, isClickable)}
                  disabled={!isClickable}
                >
                  {getSeatNumber(seat.id)}
                </button>
              );
            })}
          </div>

          {/* 2. 3x2 테이블 1개 (D-13 ~ D-18) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
              width: "180px", // 3열 테이블 너비
            }}
          >
            {groupDSeats.slice(12, 18).map((seat) => {
              const isClickable = mode === "select" && isSeatAvailable(seat.id);
              return (
                <button
                  key={seat.id}
                  onClick={() => isClickable && onSeatClick?.(seat.id)}
                  style={getSeatStyle(seat.id, isClickable)}
                  disabled={!isClickable}
                >
                  {getSeatNumber(seat.id)}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- 하단 배치 (D-19 ~ D-32): 1x8 줄 1개 + 3x2 테이블 1개 --- */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "flex-start",
            maxWidth: "700px",
          }}
        >
          {/* 1. 1x8 줄 (D-19 ~ D-26) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: "8px",
              flex: 1,
            }}
          >
            {groupDSeats.slice(18, 26).map((seat) => {
              const isClickable = mode === "select" && isSeatAvailable(seat.id);
              return (
                <button
                  key={seat.id}
                  onClick={() => isClickable && onSeatClick?.(seat.id)}
                  style={getSeatStyle(seat.id, isClickable)}
                  disabled={!isClickable}
                >
                  {getSeatNumber(seat.id)}
                </button>
              );
            })}
          </div>

          {/* 2. 3x2 테이블 1개 (D-27 ~ D-32) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
              width: "150px", // 3열 테이블 너비
            }}
          >
            {groupDSeats.slice(26, 32).map((seat) => {
              const isClickable = mode === "select" && isSeatAvailable(seat.id);
              return (
                <button
                  key={seat.id}
                  onClick={() => isClickable && onSeatClick?.(seat.id)}
                  style={getSeatStyle(seat.id, isClickable)}
                  disabled={!isClickable}
                >
                  {getSeatNumber(seat.id)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* grade prop에 따라 3학년 좌석 또는 2학년 좌석 그룹(B, C, D)이 렌더링됨 */}
      {renderGroupA()}
      {renderGroupB()}
      {renderGroupC()}
      {renderGroupD()}

      {/* 색상 범례 */}
      {mode === "view" && (
        <div
          style={{
            marginTop: "30px",
            padding: "15px",
            background: "#F9FAFB",
            borderRadius: "8px",
          }}
        >
          <p style={{ fontWeight: "bold", marginBottom: "10px" }}>범례:</p>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  background: "#10B981",
                  border: "2px solid #ddd",
                  borderRadius: "4px",
                }}
              ></div>
              <span>입실완료</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  background: "#F59E0B",
                  border: "2px solid #ddd",
                  borderRadius: "4px",
                }}
              ></div>
              <span>예약중</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  background: "#EF4444",
                  border: "2px solid #ddd",
                  borderRadius: "4px",
                }}
              ></div>
              <span>미입실</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  background: "white",
                  border: "2px solid #ddd",
                  borderRadius: "4px",
                }}
              ></div>
              <span>빈 좌석</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatGrid;
