import React from 'react';
import { useParams } from 'react-router-dom';
import './calendar.css'

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useCallback, useMemo, useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    differenceInCalendarDays,
    getMonth,
    isSaturday,
    isSunday,
} from "date-fns";

// 시간 선택하는 모달 띄우는 거
import TimeSelectionModal from "./TimeSelectionModal";

function EventDetailPage(){
    const { event_id } = useParams();
    const now_date = new Date()
    {/* 캘린더 만들기 */}
    //오늘 날짜 관련 상태
    const [currentDate, setCurrentDate] = useState(new Date());

    //선택한 날짜 및 모달 열림 상태
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const weekMock = ["일", "월", "화", "수", "목", "금", "토"]
    const nextMonthHandler = useCallback(()=>{
        setCurrentDate(addMonths(currentDate, 1));
    }, [currentDate]);
    const preMonthHandler = useCallback(()=>{
        setCurrentDate(subMonths(currentDate, 1));
    }, [currentDate]);
    const createMonth = useMemo(()=>{
        const monthArray = [];
        let day = startDate;
        while(differenceInCalendarDays(endDate, day)>=0){
            monthArray.push(day)
            day = addDays(day, 1);
        }
        return monthArray;
    },[startDate, endDate]);


    return (
        <div className="container">
            <div className='calendarWrapper'>
                <div className="calendar">
                    {/*년*/}
                    <div className="year">
                        {format(currentDate, "yyyy")}
                    </div>
                    {/*월*/}
                    <div className="monthContainer">
                        <button className="prevBtn" onClick={preMonthHandler}>
                            <HiChevronLeft />
                        </button>
                        <div className="month">
                            {format(currentDate, "MM")}
                        </div>
                        <button className="nextBtn" onClick={nextMonthHandler}>
                            <HiChevronRight />
                        </button>
                    </div>
                    {/*요일*/}
                    <div className="dayContainer">
                        {weekMock.map((v, i)=>{
                            let style;
                            if (i==0){
                                style ={
                                    color:"red",
                                };
                            }
                            else if (i==6){
                                style= {
                                    color:"blue",
                                };
                            }
                            return (
                                <div key={`day${i}`} style={style}>
                                    {v}
                                </div>
                            )
                        })}
                    </div>
                    {/*일(날짜)*/}
                    <div className="dateContainer">
                        {createMonth.map((v, i)=>{
                            let style;
                            //이 날짜의 데이터가 현재 달과 같은 날짜인지
                            const validation = (getMonth(currentDate) == getMonth(v));
                            //이 데이터가 오늘인지
                            const today = (format(now_date, "yyyyMMdd")==format(v, "yyyyMMdd"));
                            if(validation && isSaturday(v)){
                                style={
                                    color:"blue",
                                };
                            }
                            else if (validation && isSunday(v)){
                                style={
                                    color:"red",
                                };
                            }

                            return(
                                <div key={`date${i}`}
                                //validation이 true이면 className을 currentMonth, 아니면 diffMonth
                                className={validation ? "currentMonth" : "diffMonth"}
                                style={style}>
                                    <div className="topLine">
                                        <span className='day'>
                                            {format(v, "dd")}
                                        </span>
                                        {today && <span className="todayMark"> (today)</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetailPage;
