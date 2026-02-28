import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';

export default function MyListDetail() {
  const navigate = useNavigate();
  useScrollReveal();
  return (
    <>
      <div className="page" id="page-mylistdetail">
        <div className="container">
          <div style={{ 'display': 'flex', 'gap': '40px', 'alignItems': 'flex-start' }}>
            <div style={{ 'width': '320px', 'flexShrink': '0', 'position': 'sticky', 'top': '120px' }}>
              <button className="btn-outline" onClick={() => navigate('/lists')} style={{ 'marginBottom': '24px', 'padding': '6px 18px', 'fontSize': '12px' }}>← Back to All Lists</button>
              <h1 style={{ 'margin': '0 0 12px 0', 'fontSize': '28px', 'color': 'var(--primary)', 'lineHeight': '1.2', 'fontWeight': '800', 'letterSpacing': '-0.03em' }}>
                Counselors' Top Picks</h1>
              <p style={{ 'fontSize': '14px', 'lineHeight': '1.7', 'color': 'var(--text-secondary)', 'paddingBottom': '20px', 'borderBottom': '1px solid var(--border)' }}>
                A curated selection of the most rigorous and respected programs.</p>
              <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'padding': '16px 0', 'borderBottom': '1px solid var(--border)' }}>
                <span style={{ 'fontSize': '13px', 'fontWeight': '600', 'color': 'var(--text-secondary)' }}>Total
                  Programs</span>
                <span style={{ 'fontWeight': 'bold', 'color': 'var(--primary)' }}>12</span>
              </div>
              <div style={{ 'marginTop': '24px' }}>
                <button className="btn" style={{ 'width': '100%', 'justifyContent': 'center' }}>Copy to My Lists</button>
              </div>
            </div>
            <div style={{ 'flex': '1' }}>
              <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'marginBottom': '24px' }}>
                <h2 style={{ 'margin': '0', 'fontSize': '20px', 'color': 'var(--primary)', 'fontWeight': '700' }}>Programs in
                  this list</h2>
              </div>
              <div className="card" onClick={() => navigate('/program/1')} style={{ 'display': 'flex', 'gap': '20px', 'alignItems': 'center', 'marginBottom': '15px', 'cursor': 'pointer', 'padding': '20px' }}>
                <div style={{ 'fontSize': '24px', 'fontWeight': '900', 'color': 'var(--accent)', 'minWidth': '36px', 'textAlign': 'center' }}>
                  #1</div>
                <div style={{ 'width': '56px', 'height': '56px', 'background': 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', 'borderRadius': 'var(--radius-md)', 'flexShrink': '0', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '24px' }}>
                  🎓</div>
                <div style={{ 'flex': '1' }}>
                  <h3 style={{ 'margin': '0 0 5px 0', 'fontSize': '16px', 'color': 'var(--primary)', 'fontWeight': '700' }}>
                    Stanford Pre-Collegiate Summer Institutes</h3>
                  <div style={{ 'fontSize': '13px', 'color': 'var(--text-secondary)' }}>Stanford University</div>
                </div>
                <div style={{ 'fontSize': '13px', 'fontWeight': '600', 'color': 'var(--accent)' }}>View →</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
