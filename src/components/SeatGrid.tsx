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
    return !reservations.find(
      (r) => r.seat_id === seatId && r.date === currentDate
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
    return seat?.number || "";
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

              {/* 중간 공간 */}
              <div style={{ gridColumn: "4", gridRow: "1 / 3" }}></div>

              {/* 우측 테이블 (14-19번) */}
              {groupASeats.slice(13, 19).map((seat) => {
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

              {/* 중간 공간 */}
              <div style={{ gridColumn: "4", gridRow: "1 / 3" }}></div>

              {/* 우측 테이블 (26-31번) */}
              {groupASeats.slice(25, 31).map((seat) => {
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
      </div>
    );
  };

  // B구역: 2학년 폐쇄형 (10칸 × 4줄, 마지막 줄 3칸)
  const renderGroupB = () => {
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
          B구역 - 2학년 폐쇄형 (10칸 × 4줄)
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 1fr)",
            gap: "8px",
            maxWidth: "800px",
          }}
        >
          {groupBSeats.map((seat, idx) => {
            const isClickable = mode === "select" && isSeatAvailable(seat.id);
            // 마지막 줄은 3칸만 (31-33번)
            if (seat.number >= 31 && seat.number > 33) {
              return <div key={seat.id} style={emptyStyle}></div>;
            }
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
    );
  };

  // C구역: 2학년 폐쇄형 (7칸 × 4행, 4번째 행 1,7번 공석)
  const renderGroupC = () => {
    if (grade !== 2) return null;

    const groupCSeats = seats
      .filter((s) => s.group === "C" && s.grade === 2)
      .sort((a, b) => a.number - b.number);

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
          C구역 - 2학년 폐쇄형 (7칸 × 4행)
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "8px",
            maxWidth: "600px",
          }}
        >
          {groupCSeats.map((seat, idx) => {
            const isClickable = mode === "select" && isSeatAvailable(seat.id);
            const rowNumber = Math.floor(idx / 7) + 1;
            const colNumber = (idx % 7) + 1;

            // 4번째 행의 1번, 7번은 공석
            if (rowNumber === 4 && (colNumber === 1 || colNumber === 7)) {
              return <div key={`empty-${idx}`} style={emptyStyle}></div>;
            }

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
    );
  };

  // D구역: 2학년 오픈형
  const renderGroupD = () => {
    if (grade !== 2) return null;

    const groupDSeats = seats
      .filter((s) => s.group === "D" && s.grade === 2)
      .sort((a, b) => a.number - b.number);

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
          D구역 - 2학년 오픈형
        </h3>

        {/* 상단: 2×2 테이블 3개, 3×2 테이블 1개 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            gap: "8px",
            maxWidth: "700px",
            marginBottom: "8px",
          }}
        >
          {groupDSeats.slice(0, 18).map((seat) => {
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

        {/* 하단: 8칸 1줄 + 3×2 테이블 */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: "8px",
              flex: 1,
              maxWidth: "500px",
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
              width: "150px",
            }}
          >
            {groupDSeats.slice(26).map((seat) => {
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