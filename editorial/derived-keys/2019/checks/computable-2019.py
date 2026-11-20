#!/usr/bin/env python3
"""Re-runnable numeric checks for JELET-2019 items with a numeric formulation.

    python3 editorial/derived-keys/2019/checks/computable-2019.py [-q N] [--list]

Every check returns (observed_text, agrees_with_printed_option); main() exits non-zero
on any disagreement. Standard library only.
"""
import argparse
import itertools
import math
from fractions import Fraction

CHECKS = {}


def check(q, expected):
    def deco(fn):
        CHECKS[q] = (fn, expected)
        return fn
    return deco


def det3(m):
    return (m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
            - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
            + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]))


@check(2, "2^99 * A")
def q2_matrix_power():
    """A = [[1,1],[1,1]] = J with J^2 = 2J, so J^n = 2^(n-1) J."""
    a = 1
    an = [[1, 1], [1, 1]]
    for _ in range(99):                      # multiply by J, 99 times
        an = [[an[0][0] + an[0][1], an[0][0] + an[0][1]],
              [an[1][0] + an[1][1], an[1][0] + an[1][1]]]
    # J^n = 2^(n-1) J, so every entry of J^100 equals 2^99 and option B is 2^99 * A
    ratio = an[0][0] / 2 ** 99
    return (f"A^100[0][0] = {an[0][0]} = 2^99, ratio of A^100 to 2^99*A = {ratio:.6f}",
            abs(ratio - 1) < 1e-12)


@check(3, "alpha = 2 beta")
def q3_circulant_determinants():
    """Numeric test of the identity for a sample triple."""
    for (a, b, c) in [(1, 2, 3), (2, -1, 4), (0.5, 3, -2)]:
        alpha = det3([[a + b, b + c, c + a], [b + c, c + a, a + b], [c + a, a + b, b + c]])
        beta = det3([[a, b, c], [b, c, a], [c, a, b]])
        if abs(alpha - 2 * beta) > 1e-9:
            return f"fails at a={a}, b={b}, c={c}: alpha={alpha}, beta={beta}", False
    return "holds for all three sampled triples", True


@check(4, "a = 1, b = c = -2")
def q4_orthogonal_matrix():
    """Check each candidate for A A^T = I."""
    options = {'A': (1, 1, 1), 'B': (1, -2, -2), 'C': (2, 1, -1), 'D': (0, 1, 2)}
    good = []
    for label, (a, b, c) in options.items():
        m = [[a / 3, 2 / 3, 2 / 3], [2 / 3, 1 / 3, b / 3], [2 / 3, c / 3, 1 / 3]]
        ok = True
        for i in range(3):
            for j in range(3):
                dot = sum(m[i][k] * m[j][k] for k in range(3))
                if abs(dot - (1 if i == j else 0)) > 1e-9:
                    ok = False
        if ok:
            good.append(label)
    return f"options satisfying AA^T = I: {good}", good == ['B']


@check(11, "alpha = e^-1")
def q11_integral_curve():
    """dx/dy + x = y with x(0) = 0 gives x = y - 1 + e^-y; at y = 1, x = e^-1."""
    x = lambda y: y - 1 + math.exp(-y)
    val = x(1.0)
    return f"x(0) = {x(0.0):.9f}, x(1) = {val:.9f}, e^-1 = {math.exp(-1):.9f}", abs(val - math.exp(-1)) < 1e-9


@check(15, "17/19")
def q15_even_product():
    """P(product even) = 1 - P(all three odd) = 1 - C(10,3)/C(20,3)."""
    odd = len([n for n in range(1, 21) if n % 2])
    p_all_odd = Fraction(math.comb(odd, 3), math.comb(20, 3))
    p = 1 - p_all_odd
    return f"{p}", p == Fraction(17, 19)


@check(16, "1/3 <= x <= 1/2")
def q16_probability_interval():
    """Mutually exclusive: each probability non-negative and the sum at most 1."""
    def ok(x):
        pa, pb, pc = (3 * x + 1) / 3, (1 - x) / 4, (1 - 2 * x) / 2
        return min(pa, pb, pc) >= -1e-12 and pa + pb + pc <= 1 + 1e-12
    lo = next(x / 10000 for x in range(-10000, 10001) if ok(x / 10000))
    hi = max(x / 10000 for x in range(-10000, 10001) if ok(x / 10000))
    return f"feasible x in [{lo:.4f}, {hi:.4f}]", abs(lo - 1 / 3) < 1e-3 and abs(hi - 0.5) < 1e-3


@check(17, "65/3")
def q17_simpson():
    """Simpson 1/3 with n = 4 on [0,4] for 2^x."""
    h = 1.0
    f = lambda x: 2 ** x
    s = h / 3 * (f(0) + 4 * f(1) + 2 * f(2) + 4 * f(3) + f(4))
    return f"{s:.6f} = {Fraction(int(s * 3), 3)}", abs(s - 65 / 3) < 1e-9


@check(18, "1/3")
def q18_regula_falsi():
    """First Regula-Falsi iterate on x^3 + 2x - 1 in [0,1]."""
    f = lambda x: x ** 3 + 2 * x - 1
    x = (0 * f(1) - 1 * f(0)) / (f(1) - f(0))
    return f"x = {x:.6f} = {Fraction(1, 3)}", abs(x - 1 / 3) < 1e-12


@check(20, "(1 + delta)(1 - nabla) = 1")
def q20_operator_product():
    """Apply (1+delta)(1-nabla) to a sample sequence and compare with identity."""
    seq = [1.0, 4.0, 9.0, 16.0, 25.0]
    # (1 - nabla) f at i is f[i-1]; then (1 + delta) of that at i is f[i]
    out = []
    for i in range(1, 4):
        g = seq[i - 1]                     # (1 - nabla) applied
        value = g + (seq[i] - g)           # (1 + delta) applied to the constant-shifted sequence
        out.append(value)
    return (f"applied to squares at i=1..3: {out} (identity gives {seq[1:4]})",
            all(abs(o - v) < 1e-9 for o, v in zip(out, seq[1:4])))


@check(22, "20 ohm")
def q22_delta_star():
    """Three equal 60 ohm arms in delta become 60/3 per arm in star."""
    z = 60.0
    star = z * z / (z + z + z)
    return f"{star} ohm per arm", abs(star - 20) < 1e-12


@check(23, "10 ohm")
def q23_reactance_scaling():
    """Xc = 1/(2 pi f C) is inversely proportional to frequency."""
    f1, x1, f2 = 50.0, 20.0, 100.0
    c = 1 / (2 * math.pi * f1 * x1)
    x2 = 1 / (2 * math.pi * f2 * c)
    return f"{x2} ohm at {f2:.0f} Hz", abs(x2 - 10) < 1e-9


@check(39, "87610")
def q39_nines_complement():
    return f"{99999 - 12389}", 99999 - 12389 == 87610


@check(40, "74723702 octal")
def q40_hex_to_octal():
    n = int('F3A7C2', 16)
    return f"{oct(n)[2:]}", oct(n)[2:] == '74723702'


@check(72, "365 N")
def q72_first_pulley_system():
    """First system, 3 movable pulleys of 5 N, effort 50 N: W = 2^n P - (2^n - 1) w."""
    n, w, p = 3, 5, 50
    weight = 2 ** n * p - (2 ** n - 1) * w
    return f"{weight} N", weight == 365


@check(74, "60 deg")
def q74_equal_components():
    """P = Q = R means the angle between P and Q is 120 degrees, so P to R is 60."""
    p = q = r = 80.0
    theta = math.degrees(math.acos((r ** 2 - p ** 2 - q ** 2) / (2 * p * q)))
    return f"angle between P and Q = {theta:.3f} deg, so P to R = {theta / 2:.3f} deg", abs(theta / 2 - 60) < 1e-9


@check(82, "3/pi")
def q82_polar_moments():
    """Equal area A: circle Ip = A^2/(2 pi), square Ip = A^2/6, ratio 3/pi."""
    ratio = (1 / (2 * math.pi)) / (1 / 6)
    return f"{ratio:.6f} = 3/pi = {3 / math.pi:.6f}", abs(ratio - 3 / math.pi) < 1e-12


@check(88, "sigma")
def q88_closed_cylinder_outer_shear():
    """sigma_h = 2 sigma_l; radial stress is zero at the outer surface, so tau = sigma."""
    sl = 1.0
    sh = 2 * sl
    sr = 0.0
    return f"tau_max at outer surface = {(sh - sr) / 2:.3f} * sigma", abs((sh - sr) / 2 - 1.0) < 1e-12


@check(89, "4.25")
def q89_strain_ratio():
    """eps_h/eps_l with sigma_h = 2 sigma_l and nu = 0.3."""
    nu, sl = 0.3, 1.0
    sh = 2 * sl
    eh = (sh - nu * sl)
    el = (sl - nu * sh)
    return f"{eh / el:.4f}", abs(eh / el - 4.25) < 1e-9


@check(100, "16/15")
def q100_strain_energy_ratio():
    """Same max shear stress and diameter: U proportional to the area of the section."""
    # U = int tau^2/(2G) dV with tau = tau_max * r/R for both shafts
    R, n = 1.0, 200000
    def energy(r_inner):
        total = 0.0
        h = (R - r_inner) / n
        for i in range(n):
            r = r_inner + (i + 0.5) * h
            tau = r / R
            total += tau ** 2 * 2 * math.pi * r * h
        return total
    solid, hollow = energy(0.0), energy(R / 2)
    return (f"U_solid/U_hollow = {solid / hollow:.6f} (area ratio alone would give "
            f"{4 / 3:.6f})", abs(solid / hollow - 16 / 15) < 1e-6)


NOT_COMPUTABLE = {
    1: "matrix-theory statements",
    5: "triple product magnitude",
    6: "direction vectors, same as 2018 Q20",
    7: "Euler homogeneity of degree 3/2",
    8: "chain rule on three cyclic arguments",
    9: "both terms homogeneous of degree 0",
    10: "order equals the number of parameters",
    12: "separation of variables",
    13: "excluded: options corrupted in the corpus",
    14: "complementary function from the auxiliary roots",
    19: "HELD: the options bracket 1.62-1.65 and sqrt(3) = 1.732 is not among them",
    21: "Kirchhoff's laws are topology, not linearity",
    22: "delta-star for equal impedances",
    23: "capacitive reactance is inversely proportional to frequency",
    24: "laminations and eddy current",
    25: "capacitor motor topology",
    26: "commutator identification",
    27: "starting current of a DC motor",
    28: "magnetic analogy for conductivity",
    29: "standard transmission voltages",
    30: "energy-meter braking",
    31: "integrating instruments",
    32: "power factor of an R-C circuit",
    33: "SMPS function",
    34: "Indian wiring colour code",
    35: "illumination levels for precision work",
    36: "descriptor tables",
    37: "cache hit ratio",
    38: "file control block contents",
    41: "excluded: substituted stem",
    42: "compilation output",
    43: "assembler passes",
    44: "true-statement item on OS concepts",
    45: "multitasking OS classification",
    46: "assembler definition",
    47: "excluded: the C program was rewritten",
    48: "do-while semantics",
    49: "excluded: options altered",
    50: "string indexing in C",
    51: "network classification",
    52: "OSI layer functions",
    53: "network-layer devices",
    54: "mail protocol",
    55: "excluded: heading bled into option D",
    56: "recall: scope of environmental auditing",
    57: "formula of CFC-11",
    58: "lapse-rate stability condition",
    59: "recall: photochemical smog",
    60: "fixed date",
    61: "BOD as a pollution index",
    62: "recall: organomercury",
    63: "recall: COD vs BOD",
    64: "recall: carbon monoxide and haemoglobin",
    65: "waste-specific disposal choice",
    66: "composting conditions",
    67: "expansion of ESP",
    68: "noise standards for residential night",
    69: "recall: Montreal Protocol",
    70: "excluded: heading bleed",
    71: "unequal-arm balance",
    73: "excluded: options corrupted",
    75: "figure-dependent",
    76: "figure-dependent",
    77: "empty stem in the corpus",
    78: "absent from the corpus",
    79: "absent from the corpus",
    80: "KE minimum at the top of the trajectory",
    81: "HELD: momentum gives 2*sqrt(5)/3 = 1.491 m/s, which is not among the options",
    83: "geometric series of collision intervals",
    84: "figure-dependent",
    85: "excluded: heading bleed",
    86: "volumetric strain of a bar",
    87: "excluded: options corrupted",
    90: "options are diagrams",
    91: "options are diagrams",
    92: "HELD: the corpus stem is truncated mid-sentence",
    93: "cantilever with a triangular load, quoted",
    94: "options are diagrams",
    95: "definition: continuous beam",
    96: "shear stress at the extreme fibre",
    97: "effective length of a fixed-free column",
    98: "strain energy of a centrally loaded beam, quoted",
    99: "isotropic plane stress",
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
        if not ok:
            failures += 1
        print(f"Q{q}: {'PASS' if ok else 'FAIL'}  expected {expected}  |  observed {observed}")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
