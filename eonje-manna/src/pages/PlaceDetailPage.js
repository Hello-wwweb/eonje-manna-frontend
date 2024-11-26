import React from "react";
import { useParams } from "react-router-dom";

function PlaceDetailPage() {
    const { id } = useParams(); // URL의 :id 부분을 가져옵니다.
    
    return (
        <div>
            <div>
                <h2>Place ID: {id}</h2> {/* id를 화면에 출력 */}
            </div>
        </div>
    );
}

export default PlaceDetailPage;
