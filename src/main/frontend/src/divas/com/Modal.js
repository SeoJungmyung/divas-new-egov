import React from 'react';
import '../../css/modal.css';

const Modal = (props) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open, close, header, type } = props;
  // console.log(props.children);
  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open ? 'openModal modal' : 'modal'}>
      {open ? (
          type == 1 ? (
            <section>
              <header>
                {header}
                <button className="close" onClick={close}>
                  &times;
                </button>
              </header>
              <main>{props.children}</main>
              <footer>
                <button className="close" onClick={close}>
                  close
                </button>
              </footer>
            </section>
          ) : (
            type == 2 ? (
              <section>
                <header>
                  {header}
                  <button className="close" onClick={close}>
                    &times;
                  </button>
                </header>
                <main>
                  <table id="tableData" className="tb_data_p2 bL_1gry mT10 bg_gry3">
                    <thead>
                      <tr className="tb_data_tbg bT_1blue2">
                        <th>01-09분</th>
                        <th className="bL_1blue2">10-19분</th>
                        <th className="bL_1blue2">20-29분</th>
                        <th className="bL_1blue2">30-39분</th>
                        <th className="bL_1blue2">40-49분</th>
                        <th className="bL_1blue2">50-59분</th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.children}
                    </tbody>
                  </table>
                </main>
                <footer>
                  <button className="close" onClick={close}>
                    save
                  </button>
                </footer>
              </section>
            ) : (
              type == 3 ? (
                <section>
                  <header>
                    {header}
                    <button className="close" onClick={close}>
                      &times;
                    </button>
                  </header>
                  <main>
                    <table className="tb_data_p">
                      {props.children[0]}
                    </table>
                    <table className="tb_data yauto" style={{ height: 456 }}>
                      <thead>
                        <tr className="tb_data_tbg">
                          <th>장비 ID</th>
                          <th>장비명</th>
                          <th>방송성공여부</th>
                          <th>에러 정보</th>
                          <th>최종 로깅시각</th>
                          <th>녹음파일</th>
                        </tr>
                      </thead>
                      <tbody id="list_state">{props.children[2]}</tbody>
                    </table>
                  </main>
                  <footer>
                    <button className="close" onClick={close}>
                      close
                    </button>
                  </footer>
                </section>
              ) : (
                <section>
                  <header>
                    {header}
                    <button className="close" onClick={close}>
                      &times;
                    </button>
                  </header>
                  <main>{props.children}</main>
                  <footer>
                    <button className="close" onClick={close}>
                      close
                    </button>
                  </footer>
                </section>
              )
            )
          )
        ) 
      : null}
    </div>
  );
};

export default Modal;