import { initSimulation, renderSimulationPanel } from "./simulation.js";
import { hasScene3D, renderScene3DPanel, initScene3D, disposeScenes3D } from "./scene3d.js";

export function renderVisualization(config = {}) {
  const type = config.visualization;
  const panel3d = hasScene3D(type) ? renderScene3DPanel(type, config.caption) : "";
  const legacy = renderLegacyVisualization(config);
  if (panel3d) {
    return `
      ${panel3d}
      <details class="viz-2d-alt">
        <summary>Sơ đồ 2D bổ sung</summary>
        ${legacy}
      </details>
    `;
  }
  return legacy;
}

function renderLegacyVisualization(config = {}) {
  const type = config.visualization;
  if (type === "khtn") return renderKhtnViz();
  if (type === "lab") return renderLabViz();
  if (type === "measure") return renderMeasureViz();
  if (type === "length") return renderLengthViz();
  if (type === "time") return renderTimeViz();
  if (type === "temperature") return renderTemperatureViz();
  if (type === "properties") return renderPropertiesViz();
  if (type === "forceVector") return renderForceVectorViz();
  if (type === "spring") return renderSpringViz();
  if (type === "gravity") return renderGravityViz();
  if (type === "friction") return renderFrictionViz();
  if (type === "drag") return renderDragViz();
  if (type === "energy") return renderEnergyViz();
  if (type === "energyForms") return renderEnergyFormsViz();
  if (type === "energyTransform") return renderEnergyTransformViz();
  if (type === "energyWaste") return renderEnergyWasteViz();
  if (type === "renewable") return renderRenewableViz();
  if (type === "saveEnergy") return renderSaveEnergyViz();
  if (type === "sunMotion") return renderSunMotionViz();
  if (type === "moon") return renderMoonViz();
  if (type === "solarSystem") return renderSolarSystemViz();
  if (type === "galaxy") return renderGalaxyViz();
  if (type === "motion") return renderMotionViz();
  if (type === "velocity") return renderVelocityViz();
  if (type === "measureSpeed") return renderMeasureSpeedViz();
  if (type === "stGraph") return renderStGraphViz();
  if (type === "traffic") return renderTrafficViz();
  if (type === "soundPitch") return renderSoundPitchViz();
  if (type === "echo") return renderEchoViz();
  if (type === "lightRay") return renderLightRayViz();
  if (type === "mirror") return renderMirrorViz();
  if (type === "magneticField") return renderMagneticFieldViz();
  if (type === "electromagnet") return renderElectromagnetViz();
  if (type === "force") return renderForceViz();
  if (type === "pressure") return renderPressureViz();
  if (type === "density") return renderDensityViz();
  if (type === "densityLab") return renderDensityLabViz();
  if (type === "liquidPressure") return renderLiquidPressureViz();
  if (type === "archimedes") return renderArchimedesViz();
  if (type === "moment") return renderMomentViz();
  if (type === "lever") return renderLeverViz();
  if (type === "currentSource") return renderCurrentSourceViz();
  if (type === "currentEffects") return renderCurrentEffectsViz();
  if (type === "currentVoltage") return renderCurrentVoltageViz();
  if (type === "measureIU") return renderMeasureIUViz();
  if (type === "thermalEnergy") return renderThermalEnergyViz();
  if (type === "joulemeter") return renderJoulemeterViz();
  if (type === "heatTransfer") return renderHeatTransferViz();
  if (type === "thermalExpansion") return renderThermalExpansionViz();
  if (type === "kineticEnergy") return renderKineticEnergyViz();
  if (type === "mechanicalEnergy") return renderMechanicalEnergyViz();
  if (type === "workPower") return renderWorkPowerViz();
  if (type === "refraction") return renderRefractionViz();
  if (type === "totalReflection") return renderTotalReflectionViz();
  if (type === "prism") return renderPrismViz();
  if (type === "lens") return renderLensViz();
  if (type === "focalLength") return renderFocalLengthViz();
  if (type === "magnifierLens") return renderMagnifierLensViz();
  if (type === "circuitMixed") return renderCircuitMixedViz();
  if (type === "induction") return renderInductionViz();
  if (type === "acCurrent") return renderAcCurrentViz();
  if (type === "energyCycle") return renderEnergyCycleViz();
  if (type === "heat") return renderHeatViz();
  if (type === "charge") return renderChargeViz();
  if (type === "circuit") return renderCircuitViz();
  if (type === "ohm") return renderOhmViz(config);
  if (type === "series") return renderSeriesViz();
  if (type === "parallel") return renderParallelViz();
  if (type === "power") return renderPowerViz();
  if (type === "magnet") return renderMagnetViz();
  if (type === "light") return renderLightViz();
  if (type === "sound") return renderSoundViz();
  if (type === "simulation") return renderSimulationPanel(config);
  return renderConceptViz(type);
}

export function bindVisualizations(root = document) {
  disposeScenes3D();
  initScene3D(root);
  root.querySelectorAll("[data-simulation]").forEach((el) => {
    initSimulation(el, el.dataset.simulation);
  });
}

function renderKhtnViz() {
  return `
    <div class="viz concept-viz" aria-label="Ba lĩnh vực KHTN">
      <span>Vật lí THCS</span>
      <div class="khtn-pillars">
        <span>Vật lí</span><span>Hóa học</span><span>Sinh học</span>
      </div>
      <p class="viz-caption">Vật lí nghiên cứu chuyển động, lực, nhiệt, điện, ánh sáng và âm thanh</p>
    </div>
  `;
}

function renderLabViz() {
  return `
    <div class="viz lab-viz" aria-label="An toàn phòng thí nghiệm">
      <div class="lab-item">Kính bảo hộ</div>
      <div class="lab-item">Găng tay</div>
      <div class="lab-item">Nguồn điện</div>
      <p class="viz-caption">Luôn kiểm tra thiết bị trước khi làm thí nghiệm Vật lí</p>
    </div>
  `;
}

function renderMeasureViz() {
  return `
    <div class="viz measure-viz" aria-label="Đo khối lượng">
      <div class="balance-scale">⚖️ <strong>500 g</strong></div>
      <p>Đơn vị SI: m, kg, s, A, K · Đơn vị dẫn xuất: N, J, W, Ω</p>
    </div>
  `;
}

function renderLengthViz() {
  return `
    <div class="viz length-viz" aria-label="Thước đo chiều dài">
      <div class="ruler-bar">
        <span>0</span><span>10 cm</span><span>20 cm</span><span>30 cm</span>
      </div>
      <p>1 m = 100 cm · Đọc số liệu đến hết phần thập phân của vạch nhỏ nhất</p>
    </div>
  `;
}

function renderTemperatureViz() {
  return `
    <div class="viz temperature-viz" aria-label="Thang nhiệt độ">
      <div class="temp-scale">
        <span>0°C<small>nóng chảy băng</small></span>
        <span>37°C<small>cơ thể người</small></span>
        <span>100°C<small>sôi nước</small></span>
      </div>
    </div>
  `;
}

function renderTimeViz() {
  return `
    <div class="viz time-viz" aria-label="Đo thời gian">
      <div class="valence-chips">
        <span>Đồng hồ</span><span>Bấm giờ</span><span>1 h = 60 phút</span>
      </div>
      <p>Đo thời gian chuyển động · Đơn vị: s, phút, h</p>
    </div>
  `;
}

function renderPropertiesViz() {
  return `
    <div class="viz properties-viz" aria-label="Tính chất vật lí">
      <div class="substance-row"><strong>Độ cứng</strong><span>Chống biến dạng</span></div>
      <div class="substance-row"><strong>Dẫn điện</strong><span>Kim loại tốt</span></div>
      <div class="substance-row"><strong>Dẫn nhiệt</strong><span>Đồng, nhôm</span></div>
    </div>
  `;
}

function renderMotionViz() {
  return `
    <div class="viz motion-viz" aria-label="Chuyển động">
      <div class="motion-track">
        <span class="motion-dot start">A</span>
        <span class="motion-line"></span>
        <span class="motion-dot end">B</span>
      </div>
      <p>Chuyển động: thay đổi vị trí theo thời gian so với vật tham chiếu</p>
    </div>
  `;
}

function renderVelocityViz() {
  return `
    <div class="viz velocity-viz" aria-label="Tốc độ">
      <div class="formula-chip">v = s/t</div>
      <div class="valence-chips">
        <span>v: m/s, km/h</span><span>s: m, km</span><span>t: s, h</span>
      </div>
      <p>Tốc độ = quãng đường / thời gian</p>
    </div>
  `;
}

function renderMeasureSpeedViz() {
  return `
    <div class="viz measure-speed-viz" aria-label="Đo tốc độ">
      <div class="valence-chips">
        <span>Thước / thước dây</span><span>Đồng hồ</span><span>v = s/t</span>
      </div>
      <p>Đo s và t → tính v · Lặp đo, lấy trung bình</p>
    </div>
  `;
}

function renderStGraphViz() {
  return `
    <div class="viz st-graph-viz" aria-label="Đồ thị s-t">
      <svg viewBox="0 0 200 120" aria-hidden="true" class="st-graph-svg">
        <line x1="20" y1="100" x2="180" y2="100" stroke="#333" stroke-width="2"/>
        <line x1="20" y1="100" x2="20" y2="20" stroke="#333" stroke-width="2"/>
        <line x1="20" y1="100" x2="160" y2="40" stroke="#20a36b" stroke-width="3"/>
        <text x="170" y="105" font-size="10">t</text>
        <text x="8" y="25" font-size="10">s</text>
      </svg>
      <p>Đường thẳng qua gốc → chuyển động đều · Độ dốc = v</p>
    </div>
  `;
}

function renderTrafficViz() {
  return `
    <div class="viz traffic-viz" aria-label="An toàn giao thông">
      <div class="valence-chips">
        <span>🪖 Mũ bảo hiểm</span><span>🚦 Tốc độ</span><span>🛑 Phanh</span>
      </div>
      <p>Tốc độ cao → quãng đường phanh dài → nguy hiểm</p>
    </div>
  `;
}

function renderSoundPitchViz() {
  return `
    <div class="viz sound-pitch-viz" aria-label="Độ to và độ cao">
      <div class="substance-row"><strong>Biên độ lớn</strong><span>Âm to</span></div>
      <div class="substance-row"><strong>Tần số cao</strong><span>Âm cao</span></div>
      <p>Đơn vị tần số: Hz (hertz)</p>
    </div>
  `;
}

function renderEchoViz() {
  return `
    <div class="viz echo-viz" aria-label="Phản xạ âm">
      <div class="heat-flow">
        <span>🔊 Nguồn</span>
        <span class="heat-arrow">→</span>
        <span>🧱 Vách</span>
        <span class="heat-arrow">←</span>
        <span>👂 Vọng</span>
      </div>
      <p>Tiếng vọng · Sonar đo độ sâu · Giảm ồn: cách âm</p>
    </div>
  `;
}

function renderLightRayViz() {
  return `
    <div class="viz light-ray-viz" aria-label="Tia sáng và bóng">
      <div class="light-ray">
        <span class="ray-in">☀️ →</span>
        <span class="ray-surface">▮ vật cản</span>
        <span class="ray-out">▓ bóng tối</span>
      </div>
      <p>Tia sáng đi thẳng · Nguồn hẹp → bóng sắc nét</p>
    </div>
  `;
}

function renderMirrorViz() {
  return `
    <div class="viz mirror-viz" aria-label="Ảnh trong gương phẳng">
      <div class="mirror-diagram">
        <span>👤 Vật</span>
        <span class="mirror-line">| gương</span>
        <span>👤 Ảnh ảo</span>
      </div>
      <p>Ảnh ảo, cùng kích thước, đối xứng qua gương</p>
    </div>
  `;
}

function renderMagneticFieldViz() {
  return `
    <div class="viz magnetic-field-viz" aria-label="Từ trường">
      <div class="magnet-shape">
        <span class="mag-pole">N</span>
        <span class="mag-body"></span>
        <span class="mag-pole">S</span>
      </div>
      <p>Đường sức từ: N → S (ngoài nam châm) · Kim la bàn lệch</p>
    </div>
  `;
}

function renderElectromagnetViz() {
  return `
    <div class="viz electromagnet-viz" aria-label="Nam châm điện">
      <div class="circuit-diagram">
        <span class="circuit-battery">🔋</span>
        <span class="circuit-wire">⌇⌇ cuộn dây</span>
        <span class="force-block">Fe</span>
      </div>
      <p>Dòng điện + cuộn dây + lõi sắt → nam châm điện</p>
    </div>
  `;
}

function renderForceViz() {
  return `
    <div class="viz force-viz" aria-label="Lực">
      <div class="force-diagram">
        <span class="force-block">Vật</span>
        <span class="force-arrow right">F →</span>
      </div>
      <p>Lực làm vật biến dạng hoặc đổi chuyển động · Đơn vị: N (Newton)</p>
    </div>
  `;
}

function renderForceVectorViz() {
  return `
    <div class="viz force-viz" aria-label="Biểu diễn lực">
      <div class="force-diagram">
        <span class="force-block">●</span>
        <span class="force-arrow right">F →</span>
      </div>
      <p>Mũi tên: điểm đặt, phương, chiều · Độ dài ∝ độ lớn lực</p>
    </div>
  `;
}

function renderSpringViz() {
  return `
    <div class="viz spring-viz" aria-label="Biến dạng lò xo">
      <div class="spring-row">
        <span class="spring-coil">⌇⌇⌇</span>
        <span class="force-arrow down">↓ F</span>
      </div>
      <p>Lò xo co giãn khi có lực · Biến dạng đàn hồi: trở lại hình cũ</p>
    </div>
  `;
}

function renderGravityViz() {
  return `
    <div class="viz gravity-viz" aria-label="Trọng lượng">
      <div class="formula-chip">P = m·g</div>
      <div class="valence-chips">
        <span>P: N</span><span>m: kg</span><span>g ≈ 10 N/kg</span>
      </div>
      <p>Trọng lượng do Trái Đất hút vật</p>
    </div>
  `;
}

function renderFrictionViz() {
  return `
    <div class="viz friction-viz" aria-label="Lực ma sát">
      <div class="force-diagram">
        <span class="force-arrow right">→ v</span>
        <span class="force-block">Xe</span>
        <span class="force-arrow left">← F<sub>ms</sub></span>
      </div>
      <p>Ma sát cản chuyển động trượt · Giúp phanh xe</p>
    </div>
  `;
}

function renderDragViz() {
  return `
    <div class="viz drag-viz" aria-label="Lực cản nước">
      <div class="force-diagram">
        <span class="force-arrow right">→ bơi</span>
        <span class="force-block">🐟</span>
        <span class="force-arrow left">← F<sub>cản</sub></span>
      </div>
      <p>Chất lỏng và khí cản chuyển động · Hình trơn giảm lực cản</p>
    </div>
  `;
}

function renderEnergyViz() {
  return `
    <div class="viz energy-viz" aria-label="Truyền năng lượng">
      <div class="heat-flow">
        <span class="heat-hot">Nóng</span>
        <span class="heat-arrow">→</span>
        <span class="heat-cold">Lạnh</span>
      </div>
      <p>Năng lượng truyền qua va chạm, dẫn nhiệt, bức xạ</p>
    </div>
  `;
}

function renderEnergyFormsViz() {
  return `
    <div class="viz energy-forms-viz" aria-label="Các dạng năng lượng">
      <div class="valence-chips">
        <span>Cơ năng</span><span>Nhiệt</span><span>Điện</span><span>Quang</span><span>Hóa</span>
      </div>
      <p>Mỗi dạng năng lượng có ứng dụng riêng trong đời sống</p>
    </div>
  `;
}

function renderEnergyTransformViz() {
  return `
    <div class="viz energy-transform-viz" aria-label="Chuyển hóa năng lượng">
      <div class="heat-flow">
        <span>Điện năng</span>
        <span class="heat-arrow">→</span>
        <span>Quang + Nhiệt</span>
      </div>
      <p>Đèn LED: điện → quang · Quạt: điện → cơ năng</p>
    </div>
  `;
}

function renderEnergyWasteViz() {
  return `
    <div class="viz energy-waste-viz" aria-label="Năng lượng hao phí">
      <div class="substance-row"><strong>Hữu ích</strong><span>Quay bánh xe</span></div>
      <div class="substance-row"><strong>Hao phí</strong><span>Nhiệt, tiếng ồn</span></div>
      <p>Hiệu suất = phần năng lượng hữu ích / năng lượng cung cấp</p>
    </div>
  `;
}

function renderRenewableViz() {
  return `
    <div class="viz renewable-viz" aria-label="Năng lượng tái tạo">
      <div class="valence-chips">
        <span>☀️ Mặt trời</span><span>💨 Gió</span><span>💧 Thủy điện</span><span>🌿 Sinh khối</span>
      </div>
      <p>Tái tạo nhanh hơn nhiên liệu hóa thạch</p>
    </div>
  `;
}

function renderSaveEnergyViz() {
  return `
    <div class="viz save-energy-viz" aria-label="Tiết kiệm năng lượng">
      <div class="lab-item">Tắt đèn khi không dùng</div>
      <div class="lab-item">Bóng LED tiết kiệm</div>
      <div class="lab-item">Rút phích thiết bị standby</div>
      <p>Mỗi người đều có thể góp phần tiết kiệm năng lượng</p>
    </div>
  `;
}

function renderSunMotionViz() {
  return `
    <div class="viz sun-motion-viz" aria-label="Mặt Trời mọc lặn">
      <div class="motion-track">
        <span class="motion-dot start">🌅</span>
        <span class="motion-line"></span>
        <span class="motion-dot end">🌇</span>
      </div>
      <p>Trái Đất quay quanh trục → Mặt Trời mọc lặn nhìn thấy</p>
    </div>
  `;
}

function renderMoonViz() {
  return `
    <div class="viz moon-viz" aria-label="Pha Mặt Trăng">
      <div class="valence-chips">
        <span>🌑 Trăng non</span><span>🌓 Trăng khuyết</span><span>🌕 Trăng tròn</span>
      </div>
      <p>Mặt Trăng phản chiếu ánh sáng Mặt Trời · Chu kì ~29,5 ngày</p>
    </div>
  `;
}

function renderSolarSystemViz() {
  return `
    <div class="viz solar-system-viz" aria-label="Hệ Mặt Trời">
      <div class="solar-orbit">
        <span class="solar-sun">☀️</span>
        <span class="solar-planet">🌍</span>
      </div>
      <p>Mặt Trời ở trung tâm · Trái Đất là hành tinh quay quanh Mặt Trời</p>
    </div>
  `;
}

function renderGalaxyViz() {
  return `
    <div class="viz galaxy-viz" aria-label="Ngân Hà">
      <div class="galaxy-spiral">🌀 Ngân Hà</div>
      <p>Thiên hà xoắn ốc · Hệ Mặt Trời nằm trong Ngân Hà</p>
    </div>
  `;
}

function renderPressureViz() {
  return `
    <div class="viz pressure-viz" aria-label="Áp suất">
      <div class="formula-chip">p = F/S</div>
      <p>Đơn vị: Pa (N/m²) · S lớn → p nhỏ khi cùng F</p>
    </div>
  `;
}

function renderDensityViz() {
  return `
    <div class="viz density-viz" aria-label="Khối lượng riêng">
      <div class="formula-chip">D = m/V</div>
      <div class="valence-chips">
        <span>kg/m³</span><span>g/cm³</span><span>1 g/cm³ = 1000 kg/m³</span>
      </div>
      <p>Nước ≈ 1000 kg/m³ · Nhôm ≈ 2700 kg/m³</p>
    </div>
  `;
}

function renderDensityLabViz() {
  return `
    <div class="viz density-lab-viz" aria-label="Thực hành khối lượng riêng">
      <div class="valence-chips">
        <span>⚖️ Cân m</span><span>📏 Đo V</span><span>D = m/V</span>
      </div>
      <p>Khối lập phương: V = a³ · Lặp đo giảm sai số</p>
    </div>
  `;
}

function renderLiquidPressureViz() {
  return `
    <div class="viz liquid-pressure-viz" aria-label="Áp suất chất lỏng">
      <div class="formula-chip">p = ρ·g·h</div>
      <p>h sâu hơn → p lớn hơn · Áp suất khí quyển ≈ 101 kPa</p>
    </div>
  `;
}

function renderArchimedesViz() {
  return `
    <div class="viz archimedes-viz" aria-label="Lực đẩy Archimedes">
      <div class="force-diagram">
        <span class="force-arrow down">↓ P</span>
        <span class="force-block">🚢</span>
        <span class="force-arrow up">↑ F_A</span>
      </div>
      <p>F_A = ρ·g·V · Nổi khi ρ_vật &lt; ρ_lỏng</p>
    </div>
  `;
}

function renderMomentViz() {
  return `
    <div class="viz moment-viz" aria-label="Moment lực">
      <div class="formula-chip">M = F·d</div>
      <p>Cánh tay đòn d vuông góc lực · Đơn vị N·m</p>
    </div>
  `;
}

function renderLeverViz() {
  return `
    <div class="viz lever-viz" aria-label="Đòn bẩy">
      <div class="formula-chip">F₁·d₁ = F₂·d₂</div>
      <p>Đòn bẩy cân bằng · Kìm, bàn đạp, cần cẩu</p>
    </div>
  `;
}

function renderCurrentSourceViz() {
  return `
    <div class="viz current-source-viz" aria-label="Dòng điện và nguồn">
      <div class="circuit-diagram">
        <span class="circuit-battery">🔋 Nguồn</span>
        <span class="circuit-wire">→ I →</span>
        <span class="circuit-resistor">Tải</span>
      </div>
      <p>Dòng điện tích có hướng · Nguồn duy trì U</p>
    </div>
  `;
}

function renderCurrentEffectsViz() {
  return `
    <div class="viz current-effects-viz" aria-label="Tác dụng dòng điện">
      <div class="valence-chips">
        <span>🔥 Nhiệt</span><span>🧲 Từ</span><span>💡 Quang</span>
      </div>
      <p>Dòng điện: tỏa nhiệt, tác dụng từ, làm sáng đèn</p>
    </div>
  `;
}

function renderCurrentVoltageViz() {
  return `
    <div class="viz current-voltage-viz" aria-label="I và U">
      <div class="valence-chips">
        <span>I (A) · Ampe kế tiếp</span><span>U (V) · Vôn kế song song</span>
      </div>
      <p>1 A = 1 C/s · U là hiệu thế giữa hai điểm</p>
    </div>
  `;
}

function renderMeasureIUViz() {
  return `
    <div class="viz measure-iu-viz" aria-label="Đo I và U">
      <div class="circuit-diagram">
        <span>A (tiếp)</span>
        <span class="circuit-battery">U</span>
        <span>V (song song)</span>
      </div>
      <p>Kiểm tra mắc đúng trước khi đóng mạch</p>
    </div>
  `;
}

function renderThermalEnergyViz() {
  return `
    <div class="viz thermal-energy-viz" aria-label="Nội năng">
      <div class="substance-row"><strong>Nội năng</strong><span>Chuyển động phân tử</span></div>
      <div class="substance-row"><strong>Nhiệt lượng Q</strong><span>Truyền → đổi nội năng</span></div>
      <p>Nhiệt độ cao → nội năng lớn hơn</p>
    </div>
  `;
}

function renderJoulemeterViz() {
  return `
    <div class="viz joulemeter-viz" aria-label="Joulemeter">
      <div class="formula-chip">E = U·I·t</div>
      <p>Joulemeter đo năng lượng điện (J) chuyển thành nhiệt</p>
    </div>
  `;
}

function renderHeatTransferViz() {
  return `
    <div class="viz heat-transfer-viz" aria-label="Truyền nhiệt">
      <div class="valence-chips">
        <span>Dẫn nhiệt</span><span>Đối lưu</span><span>Bức xạ</span>
      </div>
      <p>Nhiệt từ vật nóng sang vật lạnh</p>
    </div>
  `;
}

function renderThermalExpansionViz() {
  return `
    <div class="viz thermal-expansion-viz" aria-label="Nở vì nhiệt">
      <div class="formula-chip">Δl = l₀·α·Δt</div>
      <p>Vật nở khi nóng · Khe hở cầu sắt cho nở nhiệt</p>
    </div>
  `;
}

function renderKineticEnergyViz() {
  return `
    <div class="viz kinetic-energy-viz" aria-label="Động năng và thế năng">
      <div class="formula-chip">Wđ = ½mv²</div>
      <div class="formula-chip">Wt = mgh</div>
      <p>Đơn vị: J (Joule)</p>
    </div>
  `;
}

function renderMechanicalEnergyViz() {
  return `
    <div class="viz mechanical-energy-viz" aria-label="Cơ năng">
      <div class="heat-flow">
        <span>Wđ</span>
        <span class="heat-arrow">⇄</span>
        <span>Wt</span>
      </div>
      <p>Wc = Wđ + Wt · Bảo toàn khi không ma sát</p>
    </div>
  `;
}

function renderWorkPowerViz() {
  return `
    <div class="viz work-power-viz" aria-label="Công và công suất">
      <div class="formula-chip">A = F·s</div>
      <div class="formula-chip">P = A/t</div>
      <p>A: J · P: W (Watt)</p>
    </div>
  `;
}

function renderRefractionViz() {
  return `
    <div class="viz refraction-viz" aria-label="Khúc xạ ánh sáng">
      <div class="light-ray">
        <span class="ray-in">↘ tia tới</span>
        <span class="ray-surface">── mặt phân cách</span>
        <span class="ray-out">↗ tia khúc xạ</span>
      </div>
      <p>n₁sin i = n₂sin r</p>
    </div>
  `;
}

function renderTotalReflectionViz() {
  return `
    <div class="viz total-reflection-viz" aria-label="Phản xạ toàn phần">
      <div class="light-ray">
        <span class="ray-in">↘</span>
        <span class="ray-surface">──</span>
        <span class="ray-out">↗ phản xạ</span>
      </div>
      <p>Góc tới &gt; góc tới hạn → phản xạ toàn phần · Sợi quang</p>
    </div>
  `;
}

function renderPrismViz() {
  return `
    <div class="viz prism-viz" aria-label="Lăng kính">
      <div class="prism-shape">△ lăng kính → quang phổ</div>
      <p>Tách sáng trắng thành các màu · Cầu vồng</p>
    </div>
  `;
}

function renderLensViz() {
  return `
    <div class="viz lens-viz" aria-label="Thấu kính">
      <div class="valence-chips">
        <span>⌢ Hội tụ</span><span>⌣ Phân kỳ</span><span>f: tiêu cự</span>
      </div>
      <p>Tia song song → qua F (hội tụ)</p>
    </div>
  `;
}

function renderFocalLengthViz() {
  return `
    <div class="viz focal-length-viz" aria-label="Đo tiêu cự">
      <div class="valence-chips">
        <span>Vật xa</span><span>Bài B</span><span>f (m)</span>
      </div>
      <p>1/f ≈ 1/s + 1/s′ · Đo nhiều lần</p>
    </div>
  `;
}

function renderMagnifierLensViz() {
  return `
    <div class="viz magnifier-lens-viz" aria-label="Kính lúp">
      <div class="mirror-diagram">
        <span>🔍</span>
        <span>Thấu kính hội tụ</span>
        <span>Ảnh ảo ↑</span>
      </div>
      <p>Vật trong tiêu cự · G ≈ L/f</p>
    </div>
  `;
}

function renderCircuitMixedViz() {
  return `
    <div class="viz circuit-mixed-viz" aria-label="Mạch nối tiếp và song song">
      <div class="parallel-branches">
        <div><span>Nối tiếp: Rt = R₁+R₂</span></div>
        <div><span>Song song: 1/Rt = 1/R₁+1/R₂</span></div>
      </div>
      <p>Nối tiếp: cùng I · Song song: cùng U</p>
    </div>
  `;
}

function renderInductionViz() {
  return `
    <div class="viz induction-viz" aria-label="Cảm ứng điện từ">
      <div class="circuit-diagram">
        <span>🧲</span>
        <span class="circuit-wire">⌇⌇ cuộn dây</span>
        <span>⚡ cảm ứng</span>
      </div>
      <p>Chuyển động tương đối → dòng cảm ứng · Máy phát điện</p>
    </div>
  `;
}

function renderAcCurrentViz() {
  return `
    <div class="viz ac-current-viz" aria-label="Dòng điện xoay chiều">
      <svg viewBox="0 0 200 60" aria-hidden="true" class="st-graph-svg">
        <path d="M0,30 Q25,10 50,30 T100,30 T150,30 T200,30" fill="none" stroke="#20a36b" stroke-width="3"/>
      </svg>
      <p>Dòng AC đổi chiều · 50 Hz tại Việt Nam</p>
    </div>
  `;
}

function renderEnergyCycleViz() {
  return `
    <div class="viz energy-cycle-viz" aria-label="Vòng năng lượng">
      <div class="heat-flow">
        <span>☀️ Mặt Trời</span>
        <span class="heat-arrow">→</span>
        <span>🌿 Sinh vật</span>
        <span class="heat-arrow">→</span>
        <span>🛢 Hóa thạch</span>
      </div>
      <p>Chu trình năng lượng trên Trái Đất</p>
    </div>
  `;
}

function renderHeatViz() {
  return `
    <div class="viz heat-viz" aria-label="Nhiệt">
      <div class="heat-flow">
        <span class="heat-hot">Nóng</span>
        <span class="heat-arrow">→</span>
        <span class="heat-cold">Lạnh</span>
      </div>
      <p>Nhiệt chuyển từ vật nóng sang vật lạnh cho đến khi cân bằng</p>
    </div>
  `;
}

function renderChargeViz() {
  return `
    <div class="viz charge-viz" aria-label="Điện tích">
      <div class="charge-pair">
        <span class="atom-ball positive">+</span>
        <span class="atom-ball negative">−</span>
      </div>
      <p>Điện tích dương (+) và âm (−) · Đơn vị: C (Coulomb)</p>
    </div>
  `;
}

function renderCircuitViz() {
  return `
    <div class="viz circuit-viz" aria-label="Mạch điện đơn giản">
      <div class="circuit-diagram">
        <span class="circuit-battery">🔋 U</span>
        <span class="circuit-wire">──</span>
        <span class="circuit-resistor">⏚ R</span>
        <span class="circuit-wire">──</span>
        <span class="circuit-ammeter">A</span>
      </div>
      <p>Dòng điện chạy từ cực dương → âm qua mạch kín</p>
    </div>
  `;
}

function renderOhmViz(config = {}) {
  const u = config.voltage || 12;
  const r = config.resistance || 6;
  const i = (u / r).toFixed(1);
  return `
    <div class="viz ohm-viz" aria-label="Định luật Ôm">
      <div class="ohm-formula">
        <span class="formula-chip">I = U/R</span>
        <span class="formula-chip">U = I·R</span>
        <span class="formula-chip">R = U/I</span>
      </div>
      <div class="ohm-values">
        <span>U = ${u} V</span>
        <span>R = ${r} Ω</span>
        <span>I = ${i} A</span>
      </div>
      <div data-simulation="ohm" data-u="${u}" data-r="${r}"></div>
    </div>
  `;
}

function renderSeriesViz() {
  return `
    <div class="viz series-viz" aria-label="Mạch nối tiếp">
      <div class="circuit-diagram">
        <span class="circuit-battery">U</span>
        <span class="circuit-resistor">R₁</span>
        <span class="circuit-resistor">R₂</span>
      </div>
      <p>R<sub>t</sub> = R₁ + R₂ · Cùng dòng I trên mọi nhánh</p>
    </div>
  `;
}

function renderParallelViz() {
  return `
    <div class="viz parallel-viz" aria-label="Mạch song song">
      <div class="parallel-branches">
        <div><span>R₁</span></div>
        <div><span>R₂</span></div>
      </div>
      <p>1/R<sub>t</sub> = 1/R₁ + 1/R₂ · Cùng điện áp U</p>
    </div>
  `;
}

function renderPowerViz() {
  return `
    <div class="viz power-viz" aria-label="Công suất điện">
      <div class="formula-chip">P = U·I = I²·R = U²/R</div>
      <p>Đơn vị: W (Watt) · 1 kW·h = 3,6·10⁶ J</p>
    </div>
  `;
}

function renderMagnetViz() {
  return `
    <div class="viz magnet-viz" aria-label="Từ trường">
      <div class="magnet-shape">
        <span class="mag-pole">N</span>
        <span class="mag-body"></span>
        <span class="mag-pole">S</span>
      </div>
      <p>Đường sức từ đi từ cực Bắc (N) ra ngoài, vào cực Nam (S)</p>
    </div>
  `;
}

function renderLightViz() {
  return `
    <div class="viz light-viz" aria-label="Khúc xạ ánh sáng">
      <div class="light-ray">
        <span class="ray-in">↘</span>
        <span class="ray-surface">───</span>
        <span class="ray-out">↗</span>
      </div>
      <p>Góc tới = góc phản xạ (so với pháp tuyến)</p>
    </div>
  `;
}

function renderSoundViz() {
  return `
    <div class="viz sound-viz" aria-label="Sóng âm">
      <div class="sound-wave">
        <svg viewBox="0 0 300 60" aria-hidden="true">
          <path d="M0,30 Q25,10 50,30 T100,30 T150,30 T200,30 T250,30 T300,30" fill="none" stroke="#20a36b" stroke-width="3"/>
        </svg>
      </div>
      <p>Âm truyền qua môi trường elastic · Tần số cao → cao độ lớn</p>
    </div>
  `;
}

function renderConceptViz(type = "concept") {
  const labels = {
    phy_intro: "Vật lí",
    g6_b01: "KHTN",
    g7_b01: "Đo lường",
    g8_b01: "Nhiệt",
    g9_b01: "Điện học"
  };
  return `
    <div class="viz concept-viz">
      <span>${labels[type] || type || "Vật lí"}</span>
      <div class="concept-grid">
        <i></i><i></i><i></i>
        <i></i><i></i><i></i>
      </div>
    </div>
  `;
}
