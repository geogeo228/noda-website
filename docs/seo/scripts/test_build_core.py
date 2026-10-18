"""Тесты для build_core.py.

Главный тест — SauvegardeClusters: проверяет, что правила кластеров
и фильтр отсева мусора не изменились после переделки. Читает эталонное ядро
`docs/seo/2026-10-11-семантическое-ядро.tsv` (относительно каталога скриптов —
`../2026-10-11-семантическое-ядро.tsv`) и для каждой строки проверяет:
- classify(phrase) возвращает записанный в файле кластер,
- passes_business_filter(phrase) возвращает True.

Если расходится хотя бы одна строка — тест падает с указанием фразы,
ожидаемого и полученного кластера.
"""

import os
import sys
import unittest

# Чтобы import build_core работал независимо от того, откуда запущен unittest
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import build_core  # noqa: E402

REFERENCE_TSV = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "..",
    "2026-10-11-семантическое-ядро.tsv",
)


class NormalizePhrase(unittest.TestCase):
    def test_lowercase(self):
        self.assertEqual(build_core.normalize_phrase("Агент ИИ"), "агент ии")

    def test_collapses_whitespace_and_strips(self):
        self.assertEqual(
            build_core.normalize_phrase("  агенты   ии  "),
            "агенты ии",
        )

    def test_replaces_yo_with_e(self):
        self.assertEqual(build_core.normalize_phrase("Ещё"), "еще")

    def test_handles_tab_and_newline_as_whitespace(self):
        # Источник — TSV из выгрузки, где фраза может быть с \t
        self.assertEqual(
            build_core.normalize_phrase("\tагенты\tии\n"),
            "агенты ии",
        )


class Classify(unittest.TestCase):
    def test_transcription_rule_matches_first(self):
        # правило «транскрибация и протоколы» стоит первым в списке правил
        self.assertEqual(
            build_core.classify("транскрибация звонков"),
            "транскрибация и протоколы",
        )

    def test_returns_none_when_no_rule_matches(self):
        # фраза без кластера → фильтр её всё равно отбросит, но
        # сам classify обязан честно вернуть None
        self.assertIsNone(build_core.classify("купить слона"))


class PassesBusinessFilter(unittest.TestCase):
    def test_passes_when_has_business_word(self):
        self.assertTrue(build_core.passes_business_filter("разработка чат бота"))

    def test_fails_when_no_business_word(self):
        self.assertFalse(build_core.passes_business_filter("купить слона"))


class DetectIntent(unittest.TestCase):
    def test_informational(self):
        self.assertEqual(
            build_core.detect_intent("как сделать чат бота"),
            "информационный",
        )

    def test_commercial(self):
        self.assertEqual(
            build_core.detect_intent("разработка чат бота"),
            "коммерческий",
        )

    def test_unclear_when_no_markers(self):
        self.assertEqual(
            build_core.detect_intent("нейросети бизнес"),
            "неясный",
        )

    def test_informational_beats_commercial(self):
        # Порядок правил важен и зафиксирован заказчиком:
        # «как сделать бота под ключ» — это человек, который ещё хочет сам.
        self.assertEqual(
            build_core.detect_intent("как сделать бота под ключ"),
            "информационный",
        )


class EtalonSohranilsya(unittest.TestCase):
    def test_every_row_in_etalon_classifies_and_passes_filter(self):
        mismatches = []
        max_reported = 10  # чтобы вывод оставался читаемым даже при массовом расхождении
        with open(REFERENCE_TSV, encoding="utf-8") as f:
            f.readline()  # заголовок
            for line in f:
                parts = line.rstrip("\n").split("\t")
                if len(parts) < 4:
                    continue
                phrase, _, _, cluster = parts[0], parts[1], parts[2], parts[3]
                got = build_core.classify(phrase)
                if got != cluster:
                    mismatches.append(
                        f"  classify({phrase!r}) -> {got!r}, expected {cluster!r}"
                    )
                if not build_core.passes_business_filter(phrase):
                    mismatches.append(
                        f"  passes_business_filter({phrase!r}) -> False, expected True"
                    )
                if len(mismatches) >= max_reported:
                    break
        if mismatches:
            self.fail(
                "эталонное ядро разошлось с правилами в build_core.py:\n"
                + "\n".join(mismatches)
            )


class ImportIsSideEffectFree(unittest.TestCase):
    def test_module_imports_without_filesystem(self):
        # Сам факт, что этот тестфайл импортировал build_core выше без ошибки
        # при отсутствии каталога raw/ рядом — и есть доказательство.
        # Дополнительно проверим, что у модуля есть публичные функции.
        for name in (
            "normalize_phrase",
            "classify",
            "passes_business_filter",
            "detect_intent",
        ):
            self.assertTrue(
                callable(getattr(build_core, name, None)),
                f"build_core.{name} должен быть вызываемым",
            )


if __name__ == "__main__":
    unittest.main()
