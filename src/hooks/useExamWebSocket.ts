import { useEffect, useRef, useState, useCallback } from 'react';
import { Client, type IMessage } from '@stomp/stompjs';
import { API_BASE_URL } from '@/lib/api';

export interface ExamEvent {
  studentName: string;
  examTitle: string;
  studentId: string;
  examId: number;
  classId: number;
  status: string; // IN_PROGRESS, SUBMITTED, DISCONNECTED, etc.
  violationType: string | null;
  violationCount: number;
  remainingTime: number;
  eventType: string; // JOIN, REJOIN, HEARTBEAT, VIOLATION, SUBMIT, DISCONNECT, etc.
  currentTime: string;
  message: string | null;
}

interface UseExamWebSocketOptions {
  examId: string | number;
  enabled: boolean;
  onEvent?: (event: ExamEvent) => void;
}

export const useExamWebSocket = ({ examId, enabled, onEvent }: UseExamWebSocketOptions) => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<Client | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const disconnect = useCallback(() => {
    if (clientRef.current?.active) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }
    setConnected(false);
  }, []);

  useEffect(() => {
    if (!enabled || !examId) return;

    // Convert http(s) to ws(s) for SockJS websocket transport
    const wsBase = API_BASE_URL.replace(/^http/, 'ws');
    const wsUrl = `${wsBase}/ws-exam/websocket`;

    const client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 0,
      onConnect: () => {
        setConnected(true);
        setError(null);

        client.subscribe(`/topic/exam/${examId}`, (message: IMessage) => {
          try {
            const event: ExamEvent = JSON.parse(message.body);
            onEventRef.current?.(event);
          } catch (e) {
            console.error('Failed to parse exam event:', e);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
        setError(frame.headers['message'] || 'WebSocket error');
        setConnected(false);
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onWebSocketClose: () => {
        setConnected(false);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      disconnect();
    };
  }, [examId, enabled, disconnect]);

  return { connected, error, disconnect };
};
