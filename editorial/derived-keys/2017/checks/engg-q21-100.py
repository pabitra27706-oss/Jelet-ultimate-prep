#!/usr/bin/env python3
"""Re-runnable numeric checks for JELET-2017 Electrical, Computer and Mechanics/Strength
items (Q21-Q100) that have a numeric formulation.

    python3 editorial/derived-keys/2017/checks/engg-q21-100.py
    python3 editorial/derived-keys/2017/checks/engg-q21-100.py -q 96
    python3 editorial/derived-keys/2017/checks/engg-q21-100.py --list

Standard library only. Exit 0 when every check agrees with the key's expected value.
Items that are recall-based, definitional or figure-dependent are listed as
NOT-COMPUTABLE and carry no machine check in the key file.
"""
import argparse
import math

CHECKS = {}


def check(q, expected):
    def deco(fn):
        CHECKS[q] = (fn, expected)
        return fn
    return deco


@check(21, "31.83 A")
def q21_half_cycle_average():
    """Half-cycle average of a sinusoid = 2/pi * peak."""
    v = 2 / math.pi * 50
    return f"{v:.4f} A", abs(v - 31.83) < 0.01


@check(23, "nearly 0 deg leading (Xl slightly less than Xc)")
def q23_phase_angle():
    """Xl = 2*pi*f*L, Xc = 1/(2*pi*f*C); net reactance decides lead/lag."""
    f = 50.0
    xl = 2 * math.pi * f * 0.1
    xc = 1 / (2 * math.pi * f * 100e-6)
    x = xl - xc
    angle = math.degrees(math.atan2(x, 20.0))
    return (f"Xl = {xl:.3f} ohm, Xc = {xc:.3f} ohm, X = {x:.3f} ohm, angle = {angle:.3f} deg",
            x < 0 and abs(angle) < 2)


@check(28, "60 kVAR, inductive")
def q28_reactive_power():
    """Q = sqrt(S^2 - P^2) with P = S*pf, lagging => inductive."""
    s, pf = 100.0, 0.8
    p = s * pf
    q = math.sqrt(s ** 2 - p ** 2)
    return f"P = {p:.1f} kW, Q = {q:.1f} kVAR, lagging => inductive", abs(q - 60) < 0.5


@check(30, "4 ohm")
def q30_delta_star():
    """Equal delta resistances R convert to R/3 each in star."""
    return f"{12 / 3:.1f} ohm", 12 / 3 == 4


@check(31, "1114 (dimensionless)")
def q31_relative_permeability():
    """mu_r = B / (mu0 * H) with B = flux/area, H = N*I/mean length."""
    mu0 = 4 * math.pi * 1e-7
    b = 1.2e-3 / 12e-4          # Wb / m^2
    h = 500 * 2 / 1.4           # A/m
    mu_r = b / (mu0 * h)
    return f"B = {b:.4f} T, H = {h:.2f} A/m, mu_r = {mu_r:.1f}", round(mu_r) == 1114


@check(51, "0 (integer division)")
def q51_ascii_arithmetic():
    """('x' - 'w')/3 with ASCII x=120, w=118 and integer division."""
    return f"{int((120 - 118) / 3)}", int((120 - 118) / 3) == 0


@check(74, "5.12 cm (option C) with g = 10")
def q74_spring_deflection():
    """Energy: W(h + d) = 0.5*k*d^2, k = 1 kN/cm, W = 100 kg * g."""
    k = 1000 / 0.01                # N/m
    w = 100 * 10.0
    h = 0.08
    # 0.5*k*d^2 - w*d - w*h = 0
    a, b, c = 0.5 * k, -w, -w * h
    d = (-b + math.sqrt(b * b - 4 * a * c)) / (2 * a)
    return f"deflection = {d * 100:.3f} cm", abs(d * 100 - 5.123) < 0.01


@check(77, "pi*r^4/16 (ratio to pi*r^4 = 0.0625)")
def q77_second_moment_quadrant():
    """Second moment of a quadrant about a bounding radius, by direct integration."""
    r = 1.0
    n = 2000
    total = 0.0
    for i in range(n):
        # integrate in polar: I_about_x_axis = int y^2 dA, dA = rho drho dtheta, y = rho sin th
        rho = (i + 0.5) * r / n
        for j in range(360):
            th = math.radians((j + 0.5) * 90 / 360)
            y = rho * math.sin(th)
            total += y * y * rho * (r / n) * math.radians(90 / 360)
    ratio = total / (math.pi * r ** 4)
    return f"I = {ratio:.4f} * pi*r^4", abs(ratio - 0.0625) < 1e-3


@check(79, "1/9 m/s^2")
def q79_tangential_acceleration():
    """Uniform increase of speed: a_t = v/t = 20 m/s / 180 s."""
    v = 72 * 1000 / 3600
    a = v / 180
    return f"{a:.6f} m/s^2 = 1/9", abs(a - 1 / 9) < 1e-9


@check(80, "2/9 m/s^2")
def q80_centripetal_acceleration():
    """v at t = 120 s, then v^2/r."""
    a = (72 * 1000 / 3600) / 180
    v = a * 120
    a2 = v ** 2 / 800
    return f"v = {v:.4f} m/s, v^2/r = {a2:.6f} m/s^2 = 2/9", abs(a2 - 2 / 9) < 1e-6


@check(84, "17 deg")
def q84_angle_of_friction():
    """tan(phi) = mu = F/N = 300/(100*g)."""
    mu = 300 / (100 * 9.81)
    phi = math.degrees(math.atan(mu))
    return (f"mu = {mu:.4f}, phi = {phi:.2f} deg (with g = 10: {math.degrees(math.atan(300 / 1000)):.2f} deg)",
            abs(phi - 17) < 1.5)


@check(96, "45.6 MPa")
def q96_thin_cylinder_max_shear():
    """sigma_h = p*d/(2t), sigma_l = p*d/(4t), sigma_r = -p at the inner wall."""
    p, d, t = 1.2, 1800.0, 12.0     # MPa, mm, mm
    sh = p * d / (2 * t)
    sl = p * d / (4 * t)
    tau_inner = (sh - (-p)) / 2
    tau_2d = (sh - sl) / 2
    return (f"sigma_h = {sh:.1f} MPa, sigma_l = {sl:.1f} MPa, tau_max(3D, inner) = {tau_inner:.2f} MPa, tau(2D) = {tau_2d:.1f} MPa",
            abs(tau_inner - 45.6) < 0.05)


NOT_COMPUTABLE = {
    22: "w = 377 rad/s, f = w/2pi; arithmetic but trivially checkable by hand",
    24: "definition of inductance",
    25: "recall: overload protection relay",
    26: "recall: UPS output waveform",
    27: "definition: lumen",
    29: "definition: back emf at standstill",
    32: "transformer emf equation, quoted result",
    33: "recall: standard distribution transformer connection",
    34: "steady-state capacitor behaviour",
    35: "recall: fuse rupturing capacity",
    36: "recall: chip fabrication",
    37: "definition: gigabyte",
    38: "definition: compiler",
    39: "definition: memory vs storage",
    40: "definition: BCD",
    41: "definition: sorting",
    42: "convention: sequential/batch processing",
    43: "definition: computer",
    44: "classification: input devices",
    45: "definition: HTTP over TCP",
    46: "classification: internet protocols",
    47: "definition: ISP",
    48: "definition: access point",
    49: "C control flow: dangling else with n = 0",
    50: "C identifier rules",
    52: "definition: browser",
    53: "definition: e-commerce",
    54: "classification: search engines",
    56: "historical date",
    57: "quoted value of the earth's albedo",
    58: "recall: London smog",
    59: "recall: COD vs BOD",
    60: "recall: nutrients in algal bloom",
    61: "recall: Montreal Protocol",
    62: "recall: organomercury use",
    63: "recall: aircraft noise index",
    64: "classification: primary vs secondary pollutant",
    65: "convention: lapse-rate stability",
    66: "recall: blue baby syndrome",
    67: "definition: leachate",
    68: "reasoning about the BOD bottle",
    69: "solubility of gases decreases with temperature",
    71: "resultant of two equal forces, quoted",
    76: "equilibrium with a smooth wall and rough floor",
    78: "parallel axis theorem",
    82: "Atwood machine tension, quoted",
    86: "recall: fatigue strength of a ductile material",
    87: "classification: stiffness property",
    88: "relation between E, K and nu, quoted",
    92: "fixed-end moment for a UDL, quoted",
    93: "comparison of failure theories",
    94: "thin cylinder stress ratio, quoted",
    95: "definition: Castigliano's theorem",
    99: "equivalent bending moment, quoted",
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("-q", "--question", type=int)
    ap.add_argument("--list", action="store_true")
    args = ap.parse_args()

    if args.list:
        for q in range(21, 101):
            kind = "COMPUTABLE" if q in CHECKS else "NOT-COMPUTABLE"
            print(f"Q{q:<4} {kind:<16} {NOT_COMPUTABLE.get(q, '')}")
        return 0

    targets = [args.question] if args.question else sorted(CHECKS)
    failures = 0
    for q in targets:
        if q not in CHECKS:
            print(f"Q{q}: no numeric check ({NOT_COMPUTABLE.get(q, 'not applicable')})")
            continue
        fn, expected = CHECKS[q]
        observed, ok = fn()
        status = "PASS" if ok else "FAIL"
        if not ok:
            failures += 1
        print(f"Q{q}: {status}  expected {expected}  |  observed {observed}")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
