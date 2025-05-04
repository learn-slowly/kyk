'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // 폼 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 에러 상태 초기화
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 간단한 유효성 검사
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = '이름을 입력해주세요';
    }
    
    if (!formData.email.trim()) {
      errors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = '유효한 이메일 주소를 입력해주세요';
    }
    
    if (!formData.message.trim()) {
      errors.message = '문의 내용을 입력해주세요';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // 폼 제출 시뮬레이션
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      
      // 폼 초기화
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="contact-page">
      {/* 헤더 섹션 */}
      <section className="py-5 bg-gradient-primary text-white">
        <div 
          className="container py-5"
          style={{
            background: 'linear-gradient(90deg, #FF0000 0%, #FFFF00 50%, #00FF00 100%)'
          }}
        >
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="display-4 fw-bold mb-4">연락처</h1>
              <p className="lead fs-4 mb-0">
                권영국 후보 캠페인팀에 문의하세요. 소중한 의견을 기다립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 메인 콘텐츠 */}
      <section className="py-5">
        <div className="container py-4">
          <div className="row g-5">
            {/* 연락처 정보 */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4 p-lg-5">
                  <h2 className="h3 fw-bold mb-4">캠페인 본부 정보</h2>
                  
                  <div className="d-flex align-items-start mb-4 contact-item hover-effect">
                    <div className="contact-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 fs-5">
                      <i className="bi bi-geo-alt"></i>
                    </div>
                    <div>
                      <h3 className="h5 fw-bold">주소</h3>
                      <p className="mb-0">서울특별시 종로구 세종대로 178<br />권영국 캠페인 본부</p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start mb-4 contact-item hover-effect">
                    <div className="contact-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 fs-5">
                      <i className="bi bi-telephone"></i>
                    </div>
                    <div>
                      <h3 className="h5 fw-bold">전화</h3>
                      <p className="mb-0">02-123-4567</p>
                      <p className="small text-muted mb-0">평일 09:00 - 18:00</p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start mb-4 contact-item hover-effect">
                    <div className="contact-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 fs-5">
                      <i className="bi bi-envelope"></i>
                    </div>
                    <div>
                      <h3 className="h5 fw-bold">이메일</h3>
                      <p className="mb-0">contact@kyk2027.kr</p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start contact-item hover-effect">
                    <div className="contact-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 fs-5">
                      <i className="bi bi-calendar3"></i>
                    </div>
                    <div>
                      <h3 className="h5 fw-bold">일정 문의</h3>
                      <p className="mb-0">schedule@kyk2027.kr</p>
                    </div>
                  </div>
                  
                  <hr className="my-4" />
                  
                  <h3 className="h5 fw-bold mb-3">소셜 미디어</h3>
                  <div className="d-flex gap-2">
                    <a href="#" className="btn btn-outline-primary rounded-circle social-btn">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#" className="btn btn-outline-primary rounded-circle social-btn">
                      <i className="bi bi-twitter"></i>
                    </a>
                    <a href="#" className="btn btn-outline-primary rounded-circle social-btn">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="#" className="btn btn-outline-primary rounded-circle social-btn">
                      <i className="bi bi-youtube"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 문의 폼 */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4 p-lg-5">
                  <h2 className="h3 fw-bold mb-4">문의하기</h2>
                  
                  {formSubmitted ? (
                    <div className="text-center py-5">
                      <div className="display-1 text-success mb-4">
                        <i className="bi bi-check-circle"></i>
                      </div>
                      <h3 className="h4 mb-3">문의가 성공적으로 접수되었습니다</h3>
                      <p className="text-muted mb-4">빠른 시일 내에 답변 드리겠습니다.</p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => setFormSubmitted(false)}
                      >
                        다른 문의하기
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <input
                              type="text"
                              className={`form-control ${formErrors.name ? 'is-invalid' : ''} ${focusedField === 'name' ? 'focused-input' : ''}`}
                              id="name"
                              name="name"
                              placeholder="홍길동"
                              value={formData.name}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('name')}
                              onBlur={() => setFocusedField(null)}
                            />
                            <label htmlFor="name">이름 *</label>
                            {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <input
                              type="email"
                              className={`form-control ${formErrors.email ? 'is-invalid' : ''} ${focusedField === 'email' ? 'focused-input' : ''}`}
                              id="email"
                              name="email"
                              placeholder="example@email.com"
                              value={formData.email}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('email')}
                              onBlur={() => setFocusedField(null)}
                            />
                            <label htmlFor="email">이메일 *</label>
                            {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <input
                              type="tel"
                              className={`form-control ${focusedField === 'phone' ? 'focused-input' : ''}`}
                              id="phone"
                              name="phone"
                              placeholder="010-1234-5678"
                              value={formData.phone}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('phone')}
                              onBlur={() => setFocusedField(null)}
                            />
                            <label htmlFor="phone">연락처</label>
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <select
                              className={`form-select ${focusedField === 'subject' ? 'focused-input' : ''}`}
                              id="subject"
                              name="subject"
                              value={formData.subject}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('subject')}
                              onBlur={() => setFocusedField(null)}
                            >
                              <option value="">선택해주세요</option>
                              <option value="general">일반 문의</option>
                              <option value="policy">정책 관련 문의</option>
                              <option value="schedule">일정 문의</option>
                              <option value="media">언론 보도 문의</option>
                              <option value="donation">후원 문의</option>
                            </select>
                            <label htmlFor="subject">문의 유형</label>
                          </div>
                        </div>
                        
                        <div className="col-12">
                          <div className="form-floating mb-3">
                            <textarea
                              className={`form-control ${formErrors.message ? 'is-invalid' : ''} ${focusedField === 'message' ? 'focused-input' : ''}`}
                              id="message"
                              name="message"
                              placeholder="문의사항을 입력해주세요"
                              style={{ height: '150px' }}
                              value={formData.message}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('message')}
                              onBlur={() => setFocusedField(null)}
                            ></textarea>
                            <label htmlFor="message">문의 내용 *</label>
                            {formErrors.message && <div className="invalid-feedback">{formErrors.message}</div>}
                          </div>
                        </div>
                        
                        <div className="col-12">
                          <div className="form-check mb-3">
                            <input 
                              className="form-check-input"
                              type="checkbox"
                              id="privacy"
                              required
                            />
                            <label className="form-check-label" htmlFor="privacy">
                              개인정보 수집 및 이용에 동의합니다
                            </label>
                          </div>
                        </div>
                        
                        <div className="col-12 text-center">
                          <button 
                            type="submit"
                            className="btn btn-primary btn-lg px-5 submit-btn"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                전송 중...
                              </>
                            ) : '문의하기'}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 지도 섹션 */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <h2 className="display-5 fw-bold mb-4">찾아오시는 길</h2>
              <p className="lead">권영국 캠페인 본부를 방문하세요</p>
            </div>
          </div>
          
          <div className="card border-0 shadow-sm overflow-hidden map-container">
            <div className="ratio ratio-21x9">
              <div className="bg-secondary d-flex align-items-center justify-content-center text-white">
                <div className="text-center">
                  <div className="display-6 mb-3">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <h3 className="h4">지도가 여기에 표시됩니다</h3>
                  <p>(실제 구현 시 구글 지도 또는 카카오 지도가 삽입됩니다)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CSS 스타일 */}
      <style jsx>{`
        .contact-icon {
          width: 40px;
          height: 40px;
          min-width: 40px;
          transition: all 0.3s ease;
        }
        
        .contact-item {
          transition: all 0.3s ease;
          padding: 10px;
          border-radius: 8px;
        }
        
        .hover-effect:hover {
          background-color: rgba(13, 110, 253, 0.05);
          transform: translateY(-5px);
        }
        
        .hover-effect:hover .contact-icon {
          transform: scale(1.1);
        }
        
        .social-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .social-btn:hover {
          transform: translateY(-5px);
        }
        
        .focused-input {
          box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
          border-color: #86b7fe;
        }
        
        .map-container {
          transition: all 0.3s ease;
        }
        
        .map-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
        
        .submit-btn {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(var(--bs-primary-rgb), 0.3);
        }
        
        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transition: all 0.8s ease;
        }
        
        .submit-btn:hover::before {
          left: 100%;
        }
      `}</style>
    </div>
  );
} 