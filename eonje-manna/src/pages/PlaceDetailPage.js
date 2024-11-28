import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import axiosInstance from '../axiosInstance';
function MapPage({ eventId, memberId }) {
  const mapContainer = useRef(null); // 지도 컨테이너
  const [map, setMap] = useState(null); // 지도 객체
  const [markers, setMarkers] = useState([]); // 활성 마커 배열
  const [votes, setVotes] = useState({}); // 투표 데이터
  const [userVote, setUserVote] = useState(null); // 현재 사용자의 투표 대상
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색 키워드
  const [places, setPlaces] = useState([]); // 검색 결과 리스트
  const infowindow = useRef(null); // InfoWindow 객체

  useEffect(() => {
    
    const script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=618cc5a8a4d8f5e173dc58eaf13948c5&libraries=services,clusterer&autoload=false";
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 3,
        };

        const initMap = new window.kakao.maps.Map(mapContainer.current, options);
        setMap(initMap);

        // InfoWindow 초기화
        infowindow.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });

        // 지도 클릭 시 마커 생성
        window.kakao.maps.event.addListener(initMap, "click", (mouseEvent) => {
          const latLng = mouseEvent.latLng;
          addMarkerWithPlaceName(latLng, initMap);
        });

        // 기존 마커 로드
        loadMarkers(initMap);
      });
    };

    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  // 기존 마커 불러오기
  const loadMarkers = useCallback(
    (map) => {
      axiosInstance
        .get(`/api/markers/${eventId}`)
        .then((response) => {
          const loadedMarkers = response.data || [];

          loadedMarkers.forEach((markerData) => {
            const latLng = new window.kakao.maps.LatLng(
              markerData.latitude,
              markerData.longitude
            );

            const newMarker = new window.kakao.maps.Marker({
              position: latLng,
              map: map,
            });

            // 마커 클릭 이벤트 등록
            window.kakao.maps.event.addListener(newMarker, "click", () => {
              handleMarkerClick(newMarker, markerData); // 삭제 조건 확인
            });

            // 마커에 마우스오버 이벤트 등록
            window.kakao.maps.event.addListener(newMarker, "mouseover", () => {
              infowindow.current.setContent(
                `<div style="padding:5px;">${markerData.place_name}</div>`
              );
              infowindow.current.open(map, newMarker);
            });

            // 마커에 마우스아웃 이벤트 등록
            window.kakao.maps.event.addListener(newMarker, "mouseout", () => {
              infowindow.current.close();
            });

            setMarkers((currentMarkers) => [
              ...currentMarkers,
              {
                id: markerData.id,
                event_id: markerData.event_id,
                member_id: markerData.member_id,
                latitude: markerData.latitude,
                longitude: markerData.longitude,
                place_name: markerData.place_name,
              },
            ]);
          });
        })
        .catch((error) => {
          console.error("마커 로드 중 오류 발생:", error);
          alert("마커를 불러오는 중 문제가 발생했습니다.");
        });
    },
    [eventId]
  );

  // 마커 추가 함수
  const addMarkerWithPlaceName = useCallback(
    (latLng, map) => {
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.coord2Address(latLng.getLng(), latLng.getLat(), (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const placeName = result[0]?.address?.address_name || "알 수 없는 장소";

          const newMarkerData = {
            id: Date.now(), // 임시 ID 생성
            event_id: eventId,
            member_id: memberId,
            latitude: latLng.getLat(),
            longitude: latLng.getLng(),
            place_name: placeName,
          };

          const newMarker = new window.kakao.maps.Marker({
            position: latLng,
            map: map,
          });

          // 마커 클릭 이벤트 등록
          window.kakao.maps.event.addListener(newMarker, "click", () => {
            handleMarkerClick(newMarker, newMarkerData); // 삭제 조건 확인
          });

          // 마커에 마우스오버 이벤트 등록
          window.kakao.maps.event.addListener(newMarker, "mouseover", () => {
            infowindow.current.setContent(
              `<div style="padding:5px;">${newMarkerData.place_name}</div>`
            );
            infowindow.current.open(map, newMarker);
          });

          // 마커에 마우스아웃 이벤트 등록
          window.kakao.maps.event.addListener(newMarker, "mouseout", () => {
            infowindow.current.close();
          });
          // 마커 추가 함수 내에 마커 데이터를 서버에 저장하는 로직 추가
          axiosInstance.post('/api/markers/save', newMarkerData)
            .then(response => {
              console.log('마커 저장 성공:', response.data);
              setMarkers(currentMarkers => [...currentMarkers, { ...newMarkerData, id: response.data.id }]);
            })
            .catch(error => {
              console.error('마커 저장 실패:', error);
              alert('마커를 저장하는 중 문제가 발생했습니다.');
            });

          setMarkers((currentMarkers) => [...currentMarkers, newMarkerData]);
        } else {
          alert("장소 정보를 가져오는 데 실패했습니다.");
        }
      });
    },
    [eventId, memberId]
  );

  // 나머지 로직은 동일

  
  // 마커 클릭 이벤트: 삭제 기능
  const handleMarkerClick = useCallback(
    (marker, markerData) => {
      // 다른 사용자의 마커는 삭제 불가
      if (markerData.member_id !== memberId) {
        alert("다른 사용자의 마커는 삭제할 수 없습니다.");
        return;
      }

      // 지도에서 마커 제거
      marker.setMap(null);

      // 상태에서 마커 제거
      setMarkers((currentMarkers) =>
        currentMarkers.filter((m) => m.latitude !== markerData.latitude || m.longitude !== markerData.longitude)
      );

      // 백엔드로 삭제 요청
      axiosInstance
        .delete(`/api/markers/${markerData.id}`)
        .then(() => {
          console.log("마커가 성공적으로 삭제되었습니다.");
        })
        .catch((error) => {
          console.error("마커 삭제 중 오류 발생:", error);
          alert("마커 삭제 중 문제가 발생했습니다.");
        });
    },
    [memberId]
  );

  // 검색 기능
  const searchPlaces = useCallback(() => {
    if (!searchKeyword) {
      alert("검색어를 입력하세요.");
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchKeyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setPlaces(data);

        const bounds = new window.kakao.maps.LatLngBounds();
        data.forEach((place) => {
          bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
        });
        map.setBounds(bounds);
      } else {
        alert("검색 결과가 없습니다.");
      }
    });
  }, [searchKeyword, map]);

  // 검색 결과 선택 시 마커 추가
  const handlePlaceSelection = (place) => {
    const latLng = new window.kakao.maps.LatLng(place.y, place.x);
    addMarkerWithPlaceName(latLng, map);
    setPlaces([]);
  };

  // 투표 수 처리 함수
  const handleVote = (markerId) => {
    // 이전 투표가 있는 경우 해당 마커의 투표 수 감소
    if (userVote) {
      setVotes((prevVotes) => ({
        ...prevVotes,
        [userVote]: Math.max((prevVotes[userVote] || 1) - 1, 0),
      }));
    }

    // 새로운 마커에 투표
    setVotes((prevVotes) => ({
      ...prevVotes,
      [markerId]: (prevVotes[markerId] || 0) + 1,
    }));

    // 사용자 투표 대상 업데이트
    setUserVote(markerId);

    // 백엔드에 투표 반영 요청
    axiosInstance.post(`/api/events/${eventId}/votes`, { markerId, previousVote: userVote })
      .then(response => {
        console.log('투표 성공:', response.data);
    // 투표 관련 상태 업데이트 로직
  })
      .catch(error => {
        console.error('투표 실패:', error);
        alert('투표 중 문제가 발생했습니다.');
  });

  };

  return (
    <div>
      <input
        type="text"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        placeholder="키워드를 입력하세요"
      />
      <button onClick={searchPlaces}>검색</button>

      {places.length > 0 && (
        <ul>
          {places.map((place) => (
            <li key={place.id}>
              <strong>{place.place_name}</strong> - {place.address_name}
              <button onClick={() => handlePlaceSelection(place)}>선택</button>
            </li>
          ))}
        </ul>
      )}

      <div ref={mapContainer} style={{ width: "100%", height: "500px", marginTop: "10px" }}></div>

      <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#f9f9f9" }}>
        <h3>투표 리스트</h3>
        <ul>
          {markers.map((marker) => (
            <li key={marker.id}>
              <strong>{marker.place_name}</strong>
              <span style={{ marginLeft: "10px" }}>투표 수: {votes[marker.id] || 0}</span>
              <button
                style={{ marginLeft: "10px" }}
                onClick={() => handleVote(marker.id)}
                disabled={userVote === marker.id}
              >
                {userVote === marker.id ? "투표 완료" : "투표"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MapPage;
