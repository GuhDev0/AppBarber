import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "react-big-calendar/lib/css/react-big-calendar.css";

import styles from "./styles.module.css";

import { useEffect, useState } from "react";

import ModalAtividade from "./modalAtividade";
import ModalAgendamento from "./modalAgendamento";

const DragAndDropCalendar = withDragAndDrop(Calendar);

const localizer = momentLocalizer(moment);

moment.locale("pt-br");

type Evento = {
    id: number;
    title: string;
    start: Date;
    end: Date;
    colaboradorId?: number;
};

type CalendarioProps = {
    events: Evento[];
};

export default function Calendario({
    events,
}: CalendarioProps) {
    const [eventos, setEventos] =
        useState<Evento[]>(events);

    const [eventoSelecionado, setEventoSelecionado] =
        useState<any>(null);

    const [novoAgendamento, setNovoAgendamento] =
        useState<any>(null);

    useEffect(() => {
        setEventos(events);
    }, [events]);

    const atualizarEvento = (data: any) => {
        const { start, end, event } = data;

        const updated = eventos.map((e) => {
            if (e.id === event.id) {
                return {
                    ...e,
                    start: new Date(start),
                    end: new Date(end),
                };
            }

            return e;
        });

        setEventos(updated);
    };

    // clique em evento existente
    const handleEventClick = (event: any) => {
        setEventoSelecionado(event);
    };

    // clique em espaço vazio
    const handleSelectSlot = (slotInfo: any) => {
        setNovoAgendamento({
            start: slotInfo.start,
            end: slotInfo.end,
        });
    };

    const handleEventClose = () => {
        setEventoSelecionado(null);
    };

    const handleAgendamentoClose = () => {
        setNovoAgendamento(null);
    };

    return (
        <div className="h-full">
            <DragAndDropCalendar
                defaultView="day"
                views={[
                    "month",
                    "week",
                    "day",
                ]}
                defaultDate={moment().toDate()}
                events={eventos}
                localizer={localizer}
                resizable
                draggableAccessor={() => true}
                resizableAccessor={() => true}
                onEventDrop={atualizarEvento}
                onEventResize={atualizarEvento}
                onSelectEvent={handleEventClick}
                onSelectSlot={handleSelectSlot}
                selectable
                step={30}
                timeslots={2}
                className={styles.calendar}
                min={new Date(0, 0, 0, 8, 0)}
                max={new Date(0, 0, 0, 20, 0)}
                popup
            />

            {/* modal visualizar atividade */}
            {eventoSelecionado && (
                <ModalAtividade
                    event={eventoSelecionado}
                    onClose={handleEventClose}
                />
            )}

            {/* modal criar agendamento */}
            {novoAgendamento && (
                <ModalAgendamento
                    event={novoAgendamento}
                    onClose={handleAgendamentoClose}
                />
            )}
        </div>
    );
}