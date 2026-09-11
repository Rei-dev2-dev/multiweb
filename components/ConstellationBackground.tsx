"use client";

import React, { useRef, useEffect } from "react";

interface ConstellationBackgroundProps {
  className?: string;
  nodeCount?: number;
  maxDistance?: number;
  lineColor?: string;
  nodeColor?: string;
  cursorReachRadius?: number;
}

export default function ConstellationBackground({
  className = "",
  nodeCount = 75,
  maxDistance = 150,
  lineColor = "rgba(148, 163, 184, 0.45)",
  nodeColor = "rgba(100, 116, 139, 0.8)",
  cursorReachRadius = 220
}: ConstellationBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }

    let nodes: Node[] = [];

    // Initialize nodes distributed across the right canvas
    const initNodes = () => {
      nodes = [];
      const count = Math.floor((width * height) / 12500) || nodeCount;

      for (let i = 0; i < count; i++) {
        // Bias nodes towards right & bottom-right as in the original design
        const x = (0.1 + 0.9 * Math.pow(Math.random(), 0.85)) * width;
        const y = (0.1 + 0.9 * Math.pow(Math.random(), 0.85)) * height;
        const isLarge = Math.random() < 0.28;
        const radius = isLarge ? Math.random() * 2 + 3.5 : Math.random() * 1.2 + 2;

        // Gentle floating velocity so the gray web continuously moves smoothly
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.35 + 0.18; // smooth, steady drift speed

        nodes.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius
        });
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initNodes();
    };

    window.addEventListener("resize", handleResize);
    initNodes();

    // Mouse coordinates with smooth interpolation
    const mouse = {
      targetX: -1000,
      targetY: -1000,
      currX: -1000,
      currY: -1000,
      active: false
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left - 30 &&
        e.clientX <= rect.right + 30 &&
        e.clientY >= rect.top - 30 &&
        e.clientY <= rect.bottom + 30
      ) {
        mouse.targetX = e.clientX - rect.left;
        mouse.targetY = e.clientY - rect.top;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      if (mouse.active) {
        mouse.currX += (mouse.targetX - mouse.currX) * 0.16;
        mouse.currY += (mouse.targetY - mouse.currY) * 0.16;
      } else {
        mouse.currX += (-1000 - mouse.currX) * 0.1;
        mouse.currY += (-1000 - mouse.currY) * 0.1;
      }

      // 1. Update Node Positions (Floating Drift Motion)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Move node by its velocity so the gray web is always alive and moving
        node.x += node.vx;
        node.y += node.vy;

        // Soft boundary reflection
        if (node.x < width * 0.05) {
          node.x = width * 0.05;
          node.vx *= -1;
        } else if (node.x > width - 10) {
          node.x = width - 10;
          node.vx *= -1;
        }

        if (node.y < height * 0.05) {
          node.y = height * 0.05;
          node.vy *= -1;
        } else if (node.y > height - 10) {
          node.y = height - 10;
          node.vy *= -1;
        }
      }

      // 2. Render Gray Web Lines in Continuous Motion ("jaringnya yang warna abu sambil bergerak")
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            // Dynamic fading alpha as nodes drift closer or further
            const alpha = (1 - dist / maxDistance) * 0.45;
            ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // 3. Interactive Web Lines Following the Cursor
      const connectedNodeIndices: number[] = [];

      if (mouse.active && mouse.currX > -50) {
        for (let i = 0; i < nodes.length; i++) {
          const dx = mouse.currX - nodes[i].x;
          const dy = mouse.currY - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < cursorReachRadius) {
            connectedNodeIndices.push(i);

            // Dynamic line from node to cursor
            const alpha = (1 - dist / cursorReachRadius) * 0.7;
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.currX, mouse.currY);
            ctx.stroke();
          }
        }

        // Secondary cross-web connections between nodes near cursor
        for (let a = 0; a < connectedNodeIndices.length; a++) {
          for (let b = a + 1; b < connectedNodeIndices.length; b++) {
            const nA = nodes[connectedNodeIndices[a]];
            const nB = nodes[connectedNodeIndices[b]];
            const dx = nA.x - nB.x;
            const dy = nA.y - nB.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDistance * 1.25) {
              const alpha = (1 - dist / (maxDistance * 1.25)) * 0.35;
              ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;
              ctx.lineWidth = 0.9;
              ctx.beginPath();
              ctx.moveTo(nA.x, nA.y);
              ctx.lineTo(nB.x, nB.y);
              ctx.stroke();
            }
          }
        }

        // Soft glowing apex around cursor
        const glow = ctx.createRadialGradient(
          mouse.currX,
          mouse.currY,
          0,
          mouse.currX,
          mouse.currY,
          cursorReachRadius * 0.55
        );
        glow.addColorStop(0, "rgba(59, 130, 246, 0.16)");
        glow.addColorStop(1, "rgba(59, 130, 246, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(mouse.currX, mouse.currY, cursorReachRadius * 0.55, 0, Math.PI * 2);
        ctx.fill();

        // Apex connector point on the cursor
        ctx.beginPath();
        ctx.arc(mouse.currX, mouse.currY, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(37, 99, 235, 0.9)";
        ctx.fill();
      }

      // 4. Draw Circular Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const isConnected = connectedNodeIndices.includes(i);

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isConnected ? "rgba(37, 99, 235, 0.9)" : nodeColor;
        ctx.fill();

        // Outer halo ring for larger nodes or when connected
        if (node.radius > 3 || isConnected) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + (isConnected ? 3 : 2), 0, Math.PI * 2);
          ctx.strokeStyle = isConnected
            ? "rgba(59, 130, 246, 0.5)"
            : "rgba(148, 163, 184, 0.35)";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [nodeCount, maxDistance, lineColor, nodeColor, cursorReachRadius]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block pointer-events-auto ${className}`}
    />
  );
}
