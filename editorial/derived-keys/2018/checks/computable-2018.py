#!/usr/bin/env python3
"""Re-runnable numeric checks for JELET-2018 items that have a numeric formulation.

    python3 editorial/derived-keys/2018/checks/computable-2018.py
    python3 editorial/derived-keys/2018/checks/computable-2018.py -q 72
    python3 editorial/derived-keys/2018/checks/computable-2018.py --list

Standard library only. Every check returns (observed_text, agrees_with_printed_option)
and main() exits non-zero if any candidate disagrees. Recall-based, definitional and
figure-dependent items are listed NOT-COMPUTABLE and carry no machine check in the key.
"""
import argparse
import cmath
import math

CHECKS = {}


def check(q, expected):
    def deco(fn):
        CHECKS[q] = (fn, expected)
        return fn
    return deco


@check(1, "1 real root")
def q1_real_roots():
    """x^3 + x - 1 is strictly increasing (3x^2 + 1 > 0), so exactly one real root."""
    f = lambda x: x ** 3 + x - 1
    fprime_min = min(3 * x * x + 1 for x in [i / 100 for i in range(-500, 501)])
    # bisection between 0 and 1
    lo, hi = 0.0, 1.0
    for _ in range(80):
        mid = (lo + hi) / 2
        if f(lo) * f(mid) <= 0:
            hi = mid
        else:
            lo = mid
    return f"f'(x) min = {fprime_min:.3f} > 0, single root at x = {(lo + hi) / 2:.9f}", fprime_min > 0


@check(4, "-6")
def q4_symmetric_sum():
    """Sum of alpha^2 beta over the roots of x^3 + 3x^2 + x - 1."""
    # (sum a)(sum ab) - 3abc  for the symmetric sum
    s1, s2, s3 = -3.0, 1.0, 1.0
    value = s1 * s2 - 3 * s3
    # numeric confirmation by finding the roots
    import cmath as cm
    roots = [complex(-r.real, -r.imag) for r in []]
    a, b, c, d = 1.0, 3.0, 1.0, -1.0
    # Durand-Kerner
    rs = [complex(0.4, 0.9) ** k for k in range(1, 4)]
    for _ in range(200):
        new = []
        for i, r in enumerate(rs):
            num = a * r ** 3 + b * r ** 2 + c * r + d
            den = a * 1.0
            for j, o in enumerate(rs):
                if i != j:
                    den *= (r - o)
            new.append(r - num / den)
        rs = new
    numeric = sum(rs[i] ** 2 * rs[j] for i in range(3) for j in range(3) if i != j)
    return (f"symmetric identity gives {value:.1f}; numeric roots give {numeric.real:.6f}",
            abs(value + 6) < 1e-9 and abs(numeric.real + 6) < 1e-3)


@check(5, "a = 1, b = 0")
def q5_complex_power():
    """(1-i)/(1+i) = -i; (-i)^100 = 1."""
    z = (1 - 1j) / (1 + 1j)
    v = z ** 100
    return f"z = {z}, z^100 = {v.real:.9f} + {v.imag:.9f}i", abs(v - 1) < 1e-9


@check(9, "e^2/4")
def q9_minimum():
    """Minimum of e^x / x^2 on x > 0."""
    best = min((math.exp(x) / x ** 2, x) for x in [0.001 + i * 0.0005 for i in range(40000)])
    return f"minimum {best[0]:.9f} at x = {best[1]:.4f}; e^2/4 = {math.e ** 2 / 4:.9f}", abs(best[0] - math.e ** 2 / 4) < 1e-6


@check(14, "log(3/2)")
def q14_integral():
    """Integral 0..ln2 of e^x/(1+e^x) dx = ln(3/2)."""
    n = 200000
    hi = math.log(2)
    total = 0.0
    h = hi / n
    f = lambda x: math.exp(x) / (1 + math.exp(x))
    for i in range(n):
        total += f((i + 0.5) * h) * h
    return f"{total:.9f}; ln(3/2) = {math.log(1.5):.9f}", abs(total - math.log(1.5)) < 1e-6


@check(20, "AB and CD are parallel")
def q20_parallel_lines():
    """Directions AB = b - a and CD = d - c are anti-parallel."""
    a = (1, 1, 1); b = (2, 3, 0); c = (3, 5, -2); d = (0, -1, 1)
    ab = tuple(b[i] - a[i] for i in range(3))
    cd = tuple(d[i] - c[i] for i in range(3))
    cross = (ab[1] * cd[2] - ab[2] * cd[1], ab[2] * cd[0] - ab[0] * cd[2], ab[0] * cd[1] - ab[1] * cd[0])
    return f"AB = {ab}, CD = {cd}, cross = {cross}", cross == (0, 0, 0)


@check(22, "50 J")
def q22_capacitor_energy():
    """E = C V^2 / 2."""
    e = 0.5 * 100e-6 * 1000 ** 2
    return f"{e:.3f} J", abs(e - 50) < 1e-9


@check(23, "1492 AT")
def q23_ampere_turns():
    """AT = H_iron*l_iron + (B/mu0)*l_gap."""
    mu0 = 4 * math.pi * 1e-7
    at = 730 * 0.30 + (0.8 / mu0) * 0.002
    return f"{at:.1f} AT (iron {730 * 0.30:.0f} + gap {(0.8 / mu0) * 0.002:.1f})", abs(at - 1492) < 1


@check(24, "25 W")
def q24_lamp_at_half_voltage():
    """Resistance fixed: P scales as V^2."""
    r = 230 ** 2 / 100
    p = 115 ** 2 / r
    return f"R = {r:.1f} ohm, P = {p:.2f} W", abs(p - 25) < 1e-9


@check(25, "0.1 J")
def q25_inductor_energy():
    """Maximum stored energy uses the peak current: 0.5*L*(sqrt(2)*I_rms)^2."""
    e = 0.5 * 0.1 * (math.sqrt(2) * 1.0) ** 2
    return f"{e:.4f} J", abs(e - 0.1) < 1e-9


@check(26, "2904 W")
def q26_three_phase_power():
    """Star load, line voltage 220 V: I = (220/sqrt3)/|Z|, P = 3 I^2 R."""
    z = math.hypot(6, 8)
    vph = 220 / math.sqrt(3)
    i = vph / z
    p = 3 * i ** 2 * 6
    return f"|Z| = {z} ohm, V_phase = {vph:.2f} V, I = {i:.3f} A, P = {p:.1f} W (220 V per phase would give {3 * (220 / z) ** 2 * 6:.0f} W)", abs(p - 2904) < 2


@check(30, "570 rpm")
def q30_slip():
    """N = Ns (1 - s)."""
    return f"{600 * (1 - 0.05):.0f} rpm", 600 * (1 - 0.05) == 570


@check(34, "100*sqrt(3) VAR")
def q34_reactive_from_wattmeters():
    """Q = sqrt(3) |W1 - W2|."""
    q = math.sqrt(3) * abs(150 - 50)
    return f"{q:.4f} VAR = 100*sqrt(3)", abs(q - 100 * math.sqrt(3)) < 1e-9


@check(72, "0.556 m (option C) = 5/9 m")
def q72_moment_balance():
    """Man:boy = 2:1, pole 2 m carrying its own 100 N at mid-span."""
    w, pole, length = 300.0, 100.0, 2.0
    r_boy = (w + pole) / 3
    r_man = 2 * (w + pole) / 3
    x = (r_boy * length - pole * (length / 2)) / w       # moments about the man's end
    return f"boy {r_boy:.2f} N, man {r_man:.2f} N, x = {x:.6f} m", abs(x - 5 / 9) < 1e-12


@check(83, "4:1")
def q83_rectangle_vs_triangle():
    """Same base b and height h about the common base: bh^3/3 vs bh^3/12."""
    ratio = (1 / 3) / (1 / 12)
    return f"{ratio:.0f}:1", ratio == 4


@check(84, "35 km/hr")
def q84_third_car():
    """Cars 10 km apart, third meets them 8 min apart: v + 40 = 10/(8/60)."""
    v = 10 / (8 / 60) - 40
    return f"{v:.1f} km/hr", abs(v - 35) < 1e-9


@check(94, "60 MPa")
def q94_max_shear():
    """tau_max = (sigma_1 - sigma_3)/2 for principal stresses 80, 30, -40 MPa."""
    t = (80 - (-40)) / 2
    return f"{t:.1f} MPa", abs(t - 60) < 1e-9


@check(96, "2500")
def q96_strain_energy_ratio():
    """E2/E1 = A L^2 / (3 I) for a square bar of side a, with A = a^2 and I = a^4/12."""
    a, L = 0.04, 1.0
    A = a ** 2
    I = a ** 4 / 12
    ratio = A * L ** 2 / (3 * I)
    return f"{ratio:.1f}", abs(ratio - 2500) < 1e-6


@check(99, "2.5 mm")
def q99_spring_parallel():
    """k = W/delta; halving the turns doubles k; two in parallel add."""
    k = 1000 / 10.0
    k_half = 2 * k
    k_parallel = 2 * k_half
    return f"k = {k:.0f} N/mm, each half {k_half:.0f}, parallel {k_parallel:.0f}, delta = {1000 / k_parallel:.2f} mm", abs(1000 / k_parallel - 2.5) < 1e-9


NOT_COMPUTABLE = {
    3: "sign argument on a quadratic with complex roots",
    6: "divisibility by (x + 1) at x = -1",
    7: "condition for a pair of straight lines, quoted",
    8: "section formula on the z coordinate",
    10: "range of 5 + sin(x - 5) is [4, 6]",
    11: "composition of e^x and ln x",
    12: "Euler homogeneity of degree 3",
    15: "lowest-degree terms give the tangents at the origin",
    16: "normal through the origin and the point",
    17: "separation of variables gives y^2 proportional to x",
    18: "differentiate the circle family",
    21: "maximum power transfer efficiency",
    27: "figure-dependent",
    28: "PMMC principle",
    29: "transformer core construction",
    31: "copper ratio: the standard result is 0.5 and no option matches it, so the item is held",
    32: "turbine classification",
    33: "damping convention",
    35: "breaker classification",
    36: "definition: PCM",
    37: "diskette vs hard disk comparison",
    38: "definition: interpreter",
    39: "definition: sorting",
    40: "CPU components",
    41: "software classification",
    42: "EBCDIC code size",
    43: "definition: execution time",
    44: "definition: queries",
    45: "protocol classification",
    46: "expansion of VGA",
    47: "expansion of WAN",
    48: "capability of a computer",
    49: "software classification",
    50: "C control flow: nested if/else with a = 0, b = 1",
    51: "C preprocessor syntax",
    52: "software classification",
    53: "printer components",
    54: "browser protocol",
    56: "recall: nephrotoxicity",
    57: "in situ conservation examples",
    58: "recall: itai-itai",
    59: "definition: sound intensity unit",
    60: "recall: MIC classification",
    61: "formula of Freon-12",
    62: "rural waste disposal practice",
    63: "definition: garbage",
    64: "composting methods",
    65: "definition: environmental audit",
    66: "definition: aquifer",
    67: "fixed date",
    68: "definition: noise",
    69: "incineration temperature range",
    71: "dimensional comparison of four pairs",
    75: "T proportional to sqrt(L)",
    76: "second moment of a square about its diagonal, quoted",
    77: "apparent weight in an accelerating lift",
    81: "v-t slope is acceleration",
    86: "definition: impact strength",
    87: "relation between E, G and K, quoted",
    88: "volumetric strain of a thin cylinder, quoted",
    92: "normal stress on an inclined plane when sigma_x = sigma_y",
    93: "section modulus comparison at equal area",
    95: "slope of a cantilever loaded at mid-span, quoted",
    97: "ordering of yield criteria",
    98: "normal stress on the plane of maximum shear",
    100: "brittle torsion failure plane",
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("-q", "--question", type=int)
    ap.add_argument("--list", action="store_true")
    args = ap.parse_args()

    if args.list:
        for q in range(1, 101):
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
